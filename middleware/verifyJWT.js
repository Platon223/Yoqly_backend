import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/User.js'

dotenv.config()


const verJWT = (req, res, next) => {
    const cookies = req.cookies;
    const cfToken = req.body.token;

    if(!cfToken) return res.status(403).json({message: "CSRF"});

    if(!cookies?.auth) return res.status(401).json({message: "noAccToken"});

    const token = cookies.auth;
    console.log(token);
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN,
        async (err, decoded) => {
            if (err) return res.status(403).json({message: "refresh"});
            const currentUser = await User.findOne({username: decoded.username});
            if(!currentUser) return res.status(404).json({message: "tryAgain"});
            req.user = currentUser;
            next();
        }
    )
    
}

export {verJWT}