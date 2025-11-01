import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
    id: String,
    isOnline: Boolean,
    contactnotifis: {
        type: [
            {id: { type: String, required: true },
      type: { type: String, required: true },
      text: { type: String, required: true },
      from: { type: String, required: true },
      date: { type: String, required: true }}
        ],
        required: true
    },
    email: String,
    interests: String,
    name: String,
    age: Number,
    username: String,
    password: String,
    passedMFA: Boolean,
    expire_date_MFA: Date,
    subscribers: {
        type: [
            {    
                email: String,
                interests: String,
                name: String,
                age: Number,
                username: String,
                password: String,
            }
        ],
        required: true
    },
    contacts: {
        type: [
            {
                id: String,
                email: String,
                interests: String,
                name: String,
                age: Number,
                username: String,
                password: String,
                posts: {
                    type: [
                        {text: String, from: String, date: String, img: String, likes: Number, comments: {
                            type: [
                                {text: String, from: String}
                            ],
                            required: true
                        }}
                    ],
                    required: true
                },
                messages: {
                    type: [
                        {
                            id: {type: String, required: true},
                            text: {type: String, required: true},
                            fromuser: {type: String, required: true},
                            date: {type: String, required: true},
                            likes: {type: Number, required: true},
                            type: {type: String, required: true},
                            isUnread: {type: Boolean, required: true}
                        }
                    ],
                    required: true
                }
            }
        ],
        required: true
    },
    posts: {
        type: [
            {
                text: String, 
                img: String, 
                date: String, 
                likes: Number, 
                comments: {
                    type: [
                        {from: String, text: String}
                    ]
                }
            
            }
        ],
        required: true
    },
    shorts: {
        type: [
            {url: String}
        ],
        required: true
    },
    rfTk: {
        type: [
            String
        ],
        required: true
    }
});


const User = mongoose.model('User', userSchema);


export default User







