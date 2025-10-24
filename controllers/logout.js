import express from 'express'
import User from '../models/User.js';

const logout = async (req, res) => {
    const cookies = req.cookies;
    const cfToken = req.body.token;

    if(!cfToken) return res.status(403).json({message: "CSRF"});

    console.log('hereeeeeeee');

    if(!cookies?.jwt) return res.status(401).json({message: "nocookies"});

    const refreshToken = cookies.jwt;
    const currentUser = await User.findOne({rfTk: refreshToken});

    if(!currentUser) {
        res.clearCookie('jwt',  {httpOnly: true, sameSite: 'None', secure: false})
        return res.send(403).json({message: "invalid token"});
    }

    currentUser.rfTk = currentUser.rfTk.filter(rt => rt !== refreshToken);
    const result = await currentUser.save();

    res.clearCookie('jwt',  {httpOnly: true, sameSite: 'None', secure: false});
    res.clearCookie('auth',  {httpOnly: true, sameSite: 'None', secure: false})
    
    return res.status(200).json({message: "success"});

}

export {logout}