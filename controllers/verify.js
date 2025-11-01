import express from 'express'
import User from '../models/User.js'
import Codes from '../models/Codes.js'

const verifyMFA = async (req, res) => {
    const code = request.body.code
    const username = request.body.username

    const user = await User.findOne({username: username})
    if (!user) return res.status(404).json({"message": "user not found"})
    
    const realCode = await Codes.findOne({code: code, user_id: user.id})
    if (!realCode) return res.status(401).json({"message": "code is invalid"})

    const currentTime = new Date()
    if (realCode.expire_date < currentTime) {
        const deletedCode = await Codes.findByIdAndDelete(realCode.id)

        return res.status(401).json({"message": "code has been expired"})
    }

    const deletedCode = await Codes.findByIdAndDelete(realCode.id)

    return res.status(200).json({"message": "verified successufully"})
}

export {verifyMFA}