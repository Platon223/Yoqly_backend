import 'ts-node/register'
import http from 'http'
import express from 'express'
import cors from 'cors'
import path from 'path'
import bcrypt from 'bcrypt'
import CryptoJS from 'crypto-js'
import cookieParser from 'cookie-parser'
import fetch from 'node-fetch'
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import multer from 'multer'
import { verJWT } from './middleware/verifyJWT.js'
const app = express();
const server = http.createServer(app);
import User from './models/User.js'
import auth from './routes/auth.js'
import refreshTok from './routes/handleRefreshToken.js'
import logOut from './routes/logout.js'
import getUsr from './routes/getUser.js'
import decryptMess from './routes/decryptMessages.js'
import cfToken from './routes/cfToken.js'
import { createRequire } from 'module';
import { Server } from 'socket.io'
import { serialize } from 'v8';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'

dotenv.config()


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);











const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });
const mongoAPI = "mongodb+srv://root:6424webdata123@infodata.d9ge5.mongodb.net/infodata?retryWrites=true&w=majority&appName=infoData"
mongoose.connect(mongoAPI, { useNewUrlParser: true, useUnifiedTopology: true, socketTimeoutMS: 45000,  
    connectTimeoutMS: 30000 
    })
    .then(() => console.log("Connected"))
    .catch((err) => console.log(err));

const db = mongoose.connection;

db.on('disconnected', () => {
    mongoose.connect(mongoAPI, { useNewUrlParser: true, useUnifiedTopology: true, socketTimeoutMS: 45000,
        connectTimeoutMS: 30000  
        })
    .then(() => console.log("Connected"))
    .catch((err) => console.log(err));
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({storage});

app.use(helmet());


let limiter = rateLimit({
    max: 10,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP address, try agagin later'
})



app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());




app.use(cors(
        {
        origin: 'http://localhost:5173',
        credentials: true
    }
));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(limiter);

app.use('/login', auth);
app.use('/getAccToken', refreshTok);
app.use('/logout', logOut);
app.use('/getUser', verJWT, getUsr);
app.use('/decrypt', verJWT, decryptMess);
app.use('/cfToken', cfToken);



app.get('/allUsers', verJWT, async (req, res) => {
    const allUsers = await User.find();

    res.json(allUsers);
})

app.post('/sendImgMes', upload.single('image'), async (req, res) => {

    console.log('helloooooookojojojoj');



    const filename = `${req.file.filename}`;

    console.log('helloooooookojojojoj');

    console.log(req.file.filename);

    const frontEndData = {
        id: req.body.id,
        text: filename,
        fromuser: req.body.fromuser,
        date: req.body.date,
        to: req.body.to,
        from: req.body.from,
        likes: Number(req.body.likes),
        type: req.body.type,
        isUnread: Boolean(req.body.isUnread)
    }

    const newMessage = {
        id: req.body.id,
        text: filename,
        fromuser: req.body.fromuser,
        date: req.body.date,
        likes: Number(req.body.likes),
        type: req.body.type,
        isUnread: Boolean(req.body.isUnread)
    }

        const senderFilt = {id: req.body.from, 'contacts.id': req.body.to};
        const senderUpdate = {$push: { 'contacts.$.messages': newMessage }};
        await User.updateOne(senderFilt, senderUpdate);


        const recieveFilt = {id: req.body.to, 'contacts.id': req.body.from};
        const recieveUpdate = {$push: { 'contacts.$.messages': newMessage }};
        await User.updateOne(recieveFilt, recieveUpdate);
        
        io.emit('quick-messanger-recieve', frontEndData);


    res.json('sent');
})

app.post('/sendVidMes', upload.single('video'), async (req, res) => {
        const filename = `${req.file.filename}`;

    console.log(req.file.filename);

    const frontEndData = {
        id: req.body.id,
        text: filename,
        fromuser: req.body.fromuser,
        date: req.body.date,
        to: req.body.to,
        from: req.body.from,
        likes: Number(req.body.likes),
        type: req.body.type,
        isUnread: Boolean(req.body.isUnread)
    }

    const newMessage = {
        id: req.body.id,
        text: filename,
        fromuser: req.body.fromuser,
        date: req.body.date,
        likes: Number(req.body.likes),
        type: req.body.type,
        isUnread: Boolean(req.body.isUnread)
    }

        const senderFilt = {id: req.body.from, 'contacts.id': req.body.to};
        const senderUpdate = {$push: { 'contacts.$.messages': newMessage }};
        await User.updateOne(senderFilt, senderUpdate);


        const recieveFilt = {id: req.body.to, 'contacts.id': req.body.from};
        const recieveUpdate = {$push: { 'contacts.$.messages': newMessage }};
        await User.updateOne(recieveFilt, recieveUpdate);
        
        io.emit('quick-messanger-recieve', frontEndData);


    res.json('sent');

})








async function checkInternet() {

    try{
        const res = await fetch('https://google.com');
        if(!res.ok) {
            return true
        }
    } catch(error) {
       return false
    }
   
}

export default checkInternet












server.listen(4000, () => {
    console.log('Server is ready');
});

io.on('connection', (socket) => {

    console.log('hey');

    

    socket.on('change', data => {
        bodyText.push(data);
        console.log(data);
    })


    socket.on('createAcc', async (data) => {
        const salt = await bcrypt.genSalt(12);
        const securedPassword = await bcrypt.hash(data.password, salt);


        const newAcc = new User({
            id: data.id,
            isOnline: data.isOnline,
            contactnotifis: data.contactnotifis,
            email: data.email,
            interests: data.interest,
            name: data.name,
            age: data.age,
            username: data.username,
            password: securedPassword,
            subscribers: data.subscribers,
            contacts: data.contacts,
            posts: data.posts,
            shorts: data.shorts
        });

        await newAcc.save();
    })





    socket.on('add-Contact', async (data) => {
        console.log(data.id)
        console.log(typeof data);
        const filter = {id: data.id};
        const update = {
            $set: {
                id: data.id,
                isOnline: data.isOnline,
                contactnotifis: data.contactnotifis,
                email: data.email,
                interests: data.interest,
                name: data.name,
                age: data.age,
                username: data.username,
                password: data.password,
                subscribers: data.subscribers,
                contacts: data.contacts,
                posts: data.posts,
                shorts: data.shorts
            }
           
        }
    
        const result = await User.updateOne(filter, update);
    })

    socket.on('isTyping', (data) => {
        const frontEndData = {to: data.to, from: data.from};
        io.emit('recieveTyping', frontEndData);
    })

    socket.on('quick-messanger-update', async (data) => {
        const cipherText = CryptoJS.AES.encrypt(data.text, process.env.CRYPTO_KEY);

        console.log('here');
        const frontEndData = {
            id: data.id,
            text: data.text,
            fromuser: data.fromuser,
            date: data.date,
            to: data.to,
            from: data.from,
            likes: data.likes,
            type: data.type,
            isUnread: data.isUnread
        }

        const newMessage = {
            id: data.id,
            text: cipherText,
            fromuser: data.from,
            date: data.date,
            likes: data.likes,
            type: data.type,
            isUnread: data.isUnread
        }

        const senderFilt = {id: data.from, 'contacts.id': data.to};
        const senderUpdate = {$push: { 'contacts.$.messages': newMessage }};
        await User.updateOne(senderFilt, senderUpdate);


        const recieveFilt = {id: data.to, 'contacts.id': data.from};
        const recieveUpdate = {$push: { 'contacts.$.messages': newMessage }};
        await User.updateOne(recieveFilt, recieveUpdate);
        
        io.emit('quick-messanger-recieve', frontEndData);
    })

    socket.on('delete-message-both', async (data) => {
        await User.findOneAndUpdate(
            {
                id: data.from,
                'contacts.id': data.to
            },
            {
                $pull: {
                    'contacts.$.messages': {
                        id: data.message
                    }
                }
            },
            {new: true}
        )

        await User.findOneAndUpdate(
            {
                id: data.to,
                'contacts.id': data.from
            },
            {
                $pull: {
                    'contacts.$.messages': {
                        id: data.message
                    }
                }
            },
            {new: true}
        )

        console.log('deleted for both users');

        const frontEndData = {to: data.to, from: data.from, message: data.message};

        io.emit('deleted-message-both-frontend', frontEndData);
    })

    socket.on('delete-message-me', async (data) => {
        await User.findOneAndUpdate(
            {
                id: data.from,
                'contacts.id': data.to     
            },
            {
                $pull: {
                    'contacts.$.messages': {
                        id: data.message
                    }
                }
            },
            {new: true}
        )

        console.log('deleted for one user');

        const frontEndData = {to: data.to, from: data.from, message: data.message};

        io.emit('deleted-message-me-frontend', frontEndData);
    })

    socket.on('online-request', async (data) => {
        console.log('online message');
        await User.findOneAndUpdate(
            {id: data.from},
            {$set: {isOnline: data.status}}
        )

        const frontEndData = {
            from: data.from,
            status: data.status
        }

        io.emit('online-approved', frontEndData);
    })

    socket.on('like-message', async (data) => {
        await User.updateMany(
            { "contacts.messages.id": data.message },                 
            { $inc: { "contacts.$[].messages.$[msg].likes": 1 } },    
            { arrayFilters: [{ "msg.id": data.message }] }                
        );

        const frontEndData = {
            to: data.to,
            from: data.from,
            message: data.message
        }

        socket.emit('front-like-update', frontEndData);

    })

    socket.on('mark-as-read', async (data) => {
        await User.findOneAndUpdate(
            {
                id: data.from,
                'contacts.id': data.to
            },

            {
                $set: {
                    'contacts.$[contact].messages.$[message].isUnread': false
                }
            },
            {arrayFilters: [{'contact.id': data.to}, {'message.isUnread': true}]},
            {new: true}
        );

        await User.findOneAndUpdate(
            {
                id: data.to,
                'contacts.id': data.from
            },

            {
                $set: {
                    'contacts.$[contact].messages.$[message].isUnread': false
                }
            },
            {arrayFilters: [{'contact.id': data.from}, {'message.isUnread': true}]},
            {new: true}
        );


        const frontEndData = {to: data.to, from: data.from};

        socket.emit('contact-read', frontEndData);
    })

    socket.on('messageNoti', async (data) => {
        const newNotifi = {
            id: data.id,
            type: data.type,
            text: data.text,
            from: data.from,
            date: data.date,
        }
        const filter = {id: data.to};
        const update = {$push: {'contactnotifis': newNotifi}};
        await User.updateOne(filter, update);

        const frontResponse = {
            from: data.from,
            to: data.to,
            text: data.text
        }

        io.emit('notiUpdate', frontResponse);
    })

    socket.on('add-Contact-toUser', async (data) => {
        const filter = {id: data.id};
        const update = {
            $set: {
                id: data.id,
                contactnotifis: data.contactnotifis,
                email: data.email,
                interests: data.interest,
                name: data.name,
                age: data.age,
                username: data.username,
                password: data.password,
                subscribers: data.subscribers,
                contacts: data.contacts,
                posts: data.posts,
                shorts: data.shorts
            }
           
        }
    
        const result = await User.updateOne(filter, update);
    })
});
