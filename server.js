const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const mongoose = require('mongoose');
const {User, BrowserLog} = require('./models/user.js');
const Loginregister = require('./js/loginregister.js');
const Main = require('./js/main.js');
let db = undefined;

app.use(express.static('client'))
const hostname = 'localhost';
// const hostname = '192.168.2.6';

const port = process.env.PORT||3030;

//attach http server to the socket io
const io = require('socket.io')(http);

//connect to mongoDB
const dbURI = 'mongodb+srv://garryenderson76:S6vq0QCqnFMPktaP@web-game.xt7azp0.mongodb.net/game-data?retryWrites=true&w=majority';
mongoose.connect(dbURI)
    .then((result) => http.listen(port, hostname, ()=>{
        db = result;
        console.log(`Server running at http://${hostname}:${port}`)
    }))
    .catch((err) => console.log(err))

//route
app.get('/mongo', (req,res) =>{
});
let users = 0;
//create new connection
io.on('connection', socket =>{
    users++
    console.log('users connected '+users);


    socket.on('disconnect', ()=>{
        users--
        // console.log('user disconnected');
    })
});