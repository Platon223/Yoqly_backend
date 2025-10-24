import express from 'express'
import CryptoJS from 'crypto-js';
import dotenv from 'dotenv'

dotenv.config()

function decrypt(data) {
    try {
        const bytes = CryptoJS.AES.decrypt(data, process.env.CRYPTO_KEY);

        if(bytes.sigBytes > 0) {
            const decryptMess = bytes.toString(CryptoJS.enc.Utf8);

            return decryptMess
        }
    } catch(err) {
        console.log('Invalid Key');
    }
}

const handleDecryption = (req, res) => {
    const user = req.user;
    const cfToken = req.body.token;

    if(!cfToken) return res.status(403).json({message: "CSRF"});
    
    if(!user) return res.status(401).json({message: 'unauthorized'});

    user.contacts.forEach((cont, index) => {
        cont.messages.forEach((mes, index) => {
            mes.text = decrypt(mes.text);
        })
    })

    res.json(user);

}

export {handleDecryption}