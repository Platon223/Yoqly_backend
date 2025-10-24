import express from 'express'

const visitCounter = (req, res, next) => {
    const user = req.user;
    if(!user) return res.status(401).json({message: 'unauthorized'});

    
}