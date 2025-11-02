import express from 'express'
const app = express();
import User from '../models/User.js';
import { access } from 'fs';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { Queue } from 'bullmq'

dotenv.config()

const emailQueue = new Queue('Email_MFA', {
    connection: {
        host: "localhost",
        port: 6379
    }
})


async function sendMFAEmail(emailContent) {
    await emailQueue.add("sendMFA", emailContent)
}



const loginCont = async (req, res, step) => {
    const username = req.body.username;
    const password = req.body.password;
    const cookies = req.cookies;
    const cfToken = req.body.token;

    if(!cfToken) return res.status(403).json({message: "CSRF"});

    console.log(cookies);

    console.log(username);


    const user = await User.findOne({username: username});

    if (!user) return res.status(401).json({message: "user not found"});

    if (step === 'first_entry') {
        const passwordIdentified = bcrypt.compare(password, user.password);

        if (passwordIdentified) {
            // Send Email with the verify code
            const email_options = {to: "email.com"}
            sendMFAEmail(email_options)

            return res.status(200).json({"message": "Email has been sent"})
        } 

        return res.status(401).json({"message": "invalid password"})
    }

    if (step !== 'jwt') return res.status(400).json({"message": "wrong step"})

    const currentTime = new Date()
    if (!user.passedMFA || !user.expire_date_MFA < currentTime) return res.status(401).json({"message": "not allowed"})
    
    // create jwt's 

    const accessToken = jwt.sign(
        {"username": user.username},
        process.env.ACCESS_TOKEN,
        {expiresIn: '50s'}
    )

    if(cookies?.jwt) {
        console.log('found cookies');
        const rfTk = cookies.jwt;
        const foundToken = await User.findOne({ rfTk });

        if(!foundToken) {
            user.rfTk = [];

            await user.save();
        } else {
            const newrfTkArray = user.rfTk.filter(rt => rt !== cookies.jwt);
            user.rfTk = newrfTkArray;
            await user.save();
        }

        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: false});
        res.clearCookie('auth', {httpOnly: true, sameSite: 'None', secure: false})
    }

    const refreshToken = jwt.sign(
        {"username": user.username},
        process.env.REFRESH_TOKEN,
        {expiresIn: '1d'}
    )

    user.rfTk.push(refreshToken);
    await user.save();

    res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'None', secure: false})
    res.cookie('auth', accessToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'None', secure: false})

    return res.status(200).json({message: "success"});
}

export {loginCont}