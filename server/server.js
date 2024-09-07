const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
// const mongoose = require('mongoose');
let db = undefined;

app.use(express.static('client'))
const hostname = 'localhost';
// const hostname = '10.52.3.164';
// const hostname = '194.164.197.82';

const port = process.env.PORT||8181;

//attach http server to the socket io
const io = require('socket.io')(http);

//connect to mongoDB
// const dbURI = 'mongodb+srv://garryenderson76:S6vq0QCqnFMPktaP@web-game.xt7azp0.mongodb.net/game-data?retryWrites=true&w=majority';
// mongoose.connect(dbURI)
//     .then((result) => http.listen(port, hostname, ()=>{
//         db = result;
//         console.log(`Server running at http://${hostname}:${port}`)
//     }))
//     .catch((err) => console.log(err))



http.listen(port, hostname, ()=>{
    console.log(`Server running at http://${hostname}:${port}`)
})
//route
app.get('/mongo', (req,res) =>{
});


let users = 0;
let players = {};
let bullets = [];
let tick = 0;
function serverTick(){
    tick++;
    bullets.forEach(bullet=>{
        bullet.rect.x += bullet.angle.x;
        bullet.rect.y += bullet.angle.y;
    })
    let removeBullets = [];
    for (const [key, player] of Object.entries(players)) {
        //check if player has health
        if (player.stats.health <= 0){
            if (tick > player.respawn){
                // reset player stats and position
                player.stats.health = 100;
                io.sockets.emit('healthUpdate', {'id':key, 'playerHealth':player.stats.health})
            }
        }else {
            bullets.forEach(bullet=>{
                // console.log(key)
                if (bullet.owner !== key){
                    // check if player collides with bullet
                    if (player.rect.x + player.rect.width > bullet.rect.x && player.rect.x < bullet.rect.x + bullet.rect.width && player.rect.y + player.rect.height > bullet.rect.y && player.rect.y < bullet.rect.y + bullet.rect.height){
                        removeBullets.push(bullet.name)
                        player.stats.health -= 10;
                        if (player.stats.health <= 0){
                            player.rect = {'x':Math.floor(Math.random() * 1000), 'y':Math.floor(Math.random() * 1000), 'width':30, 'height':30, 'color':'purple'}
                            player.stats.health = 0;
                            player['respawn'] = tick + 50;
                            io.sockets.to(player.socketId).emit('respawnUpdate', player.rect)
                            players[bullet.owner].kills += 1;
                        }
                        //when player is het send updated health
                        io.sockets.emit('healthUpdate', {'id':key, 'playerHealth':player.stats.health})
                    }}

                //kill bullet when too old
                if (bullet.birth + 40 < tick){
                    removeBullets.push(bullet.name)
                }
            })
        }
    }
    //remove bullets by name in list
    removeBullets.map(bulletName=>{
        bullets = bullets.filter(bullet=>bullet.name !== bulletName);
    })
}


//create new connection
io.on('connection', socket =>{
    let playerData = {'socketId':socket.id, 'rect':{'x':Math.floor(-500 + Math.random() * 1000), 'y':Math.floor(-500 + Math.random() * 1000), 'width':30, 'height':30, 'color':'purple'}, 'kills':0, 'name':false, 'stats':{'health':0}}
    socket.emit('playerData', playerData)
    if (users < 1){
        // setInterval(serverTick, 500)
        setInterval(serverTick, 1000/60)
    }
    players[socket.id] = playerData;
    users++

    socket.on('respawnRequest', ()=>{
        players[socket.id].stats.health = 100;
    })

    //player Movement
    socket.on('playerMove', position=>{
        // players[socket.id].rect = position.rect;
    })
    socket.on('playerInput', keysDown=>{
        let player = players[socket.id]
        let speed = 3;
        let pressed = false;
        //w
        if (keysDown['87']){
            players[socket.id].rect.y -= speed;
            pressed = true;
        }
        //s
        if (keysDown['83']){
            players[socket.id].rect.y += speed;
            pressed = true;
        }
        //a
        if (keysDown['65']){
            players[socket.id].rect.x -= speed;
            pressed = true;
        }
        //d
        if (keysDown['68']){
            players[socket.id].rect.x += speed;
            pressed = true;
        }
        if (pressed){
            // socket.emit('playerMove', {'name':this.name, 'rect':{'x':position.x, 'y':position.y, 'width':this.playerRect.width, 'height':this.playerRect.height, 'color':'purple'}});
        }
    })

    socket.on('playerName', name=>{
        players[socket.id].name = name;
    })

    socket.on('getPlayers', id=>{
        socket.emit('getPlayersResponse', players)
    })

    //bulletsHandler
    socket.on('newBullet', bullet=>{
        bullet['birth'] = tick;
        bullets.push(bullet)
        socket.broadcast.emit('sendBullet', bullet)
    })



    console.log('users connected '+users);

    socket.on('disconnect', ()=>{
        users--
        delete players[socket.id];
        // console.log('user disconnected');
    })
});