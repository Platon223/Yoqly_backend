import express from 'express'
import User from '../models/User.js'

const getUser = async (req, res) => {
    const user = req.user;
    console.log(req.origin);

    res.json(user);
}

export {getUser}