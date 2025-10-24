import { io } from 'socket.io-client';
const socket = io('http://localhost:3000/');
class AddUser {
    constructor(nm, age, username, interest, password, email, subscribers, contacts, friends, posts, shorts) {
        this.nm = nm;
        this.age = age;
        this.username = username;
        this.interest = interest;
        this.password = password;
        this.email = email;
        this.subscribers = subscribers;
        this.contacts = contacts;
        this.friends = friends;
        this.posts = posts;
        this.shorts = shorts;
    }
    addUser() {
        try {
            const newUser = {
                nm: this.nm,
                age: this.age,
                username: this.username,
                interest: this.interest,
                password: this.password,
                email: this.email,
                subscribers: this.subscribers,
                contacts: this.contacts,
                friends: this.friends,
                posts: this.posts,
                shorts: this.shorts
            };
            socket.emit('createAcc', newUser);
            console.log('sent to server');
        }
        catch (err) {
            console.log(err);
        }
    }
}
const element = document.querySelector('.signup-button');
element === null || element === void 0 ? void 0 : element.addEventListener('click', () => {
    const nameEl = document.getElementById('name');
    const usernmEl = document.getElementById('username');
    const emailEl = document.getElementById('email');
    const mainIntEl = document.getElementById('interest');
    const passwordEl = document.getElementById('password');
    const confPassEl = document.getElementById('confirmed-password');
    if (passwordEl.value === confPassEl.value) {
        const newUser = {
            nm: nameEl.value,
            age: 13,
            username: usernmEl.value,
            interest: mainIntEl.value,
            password: passwordEl.value,
            email: emailEl.value,
            subscribers: [],
            contacts: [],
            friends: [],
            posts: [],
            shorts: []
        };
        const addUser = new AddUser(newUser.nm, newUser.age, newUser.username, newUser.interest, newUser.password, newUser.email, newUser.subscribers, newUser.contacts, newUser.friends, newUser.posts, newUser.shorts);
        addUser.addUser();
        setTimeout(() => {
            window.location.href = 'http://localhost:3000/home';
        }, 3000);
    }
    else {
        console.log('nope');
    }
});