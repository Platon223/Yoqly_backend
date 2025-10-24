import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const csrfToken = (req, res) => {
    if(req.get('Origin') !== 'http://localhost:4000') {
        res.status(403).json({message: "CSRF"});
    } else {
        return res.status(200).json({cfToken: process.env.CSRF_TOKEN});
    }
}

export {csrfToken}