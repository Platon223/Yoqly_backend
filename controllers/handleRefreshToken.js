import express from 'express'
import User from '../models/User.js';
import jwt from 'jsonwebtoken'

const handleRefresh = async (req, res) => {
    const cookies = req.cookies;
    const cfToken = req.body.token;

    if(!cfToken) return res.status(403).json({message: "CSRF"});
    console.log(cookies);

    if(!cookies?.jwt) return res.status(401).json({message: "nocookies"});

    const refreshToken = cookies.jwt;
    console.log(refreshToken);
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: false});
    res.clearCookie('auth', {httpOnly: true, sameSite: 'None', secure: false});

    const currentUser = await User.findOne({rfTk: refreshToken});


    if(!currentUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN,
            async (err, decoded) => {
                if (err) return res.status(401).json({message: "logout"});
                const hackedUsr = await User.findOne({username: decoded.username});
                hackedUsr.rfTk = [];
                const result = await hackedUsr.save();
            }
        )

        return res.status(403).json({message: "logout"});
    }

    const newrfTkArray = currentUser.rfTk.filter(rt => rt !== refreshToken);

    

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN,
        async (err, decoded) => {
            if(err) {
                currentUser.rfTk = newrfTkArray;
                await currentUser.save();

                return res.status(401).json({message: "logout"});
            }
            if (err || currentUser.username !== decoded.username) return res.sendStatus(403);

            currentUser.rfTk = newrfTkArray;
            const result = await currentUser.save();

            const accessToken = jwt.sign(
                {"username": decoded.username},
                process.env.ACCESS_TOKEN,
                {expiresIn: '50s'}
            )

            const newRefreshToken = jwt.sign(
                {"username": decoded.username},
                process.env.REFRESH_TOKEN,
                {expiresIn: '1d'}
            )
            
            currentUser.rfTk.push(newRefreshToken);
            await currentUser.save();

            console.log('done');
            
            res.cookie('jwt', newRefreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure: false, sameSite: 'None'})
            res.cookie('auth', accessToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure: false, sameSite: 'None'});

            return res.status(200).json({message: "success"});
        }
    )


}

export {handleRefresh}