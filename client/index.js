import * as jabaGame from './js/jabagame1-1.js';
import BulletsHandler from "./js/bulletsHandler.js";
import Player from "./js/player.js";

const socket = io();

let canvas = document.getElementById('canvas');
const body = document.body;
canvas.width = body.offsetWidth;
canvas.height = body.offsetHeight;
document.getElementById('submit').addEventListener('click', ()=>{
    player.name = document.getElementById('username').value;
    socket.emit('playerName', player.name)
    document.getElementById('play').click()
})


// let position = {'x':Math.floor(Math.random() * 250), 'y':Math.random() * 250};
const ctx = canvas.getContext("2d");
let jaba = new jabaGame.Init(canvas, ctx, socket);


//bulletsHandler
let bulletsHandler = new BulletsHandler(jaba, socket);


//create tile background
let grassTiles = [];
for (let y = 0; y < 15; y++) {
    for (let x = 0; x < 15; x++) {
        const grass = new jabaGame.Image(ctx, 'grass', -1000 + 140*x, -1000 + 140*y, 141, 141)
        grassTiles.push(grass);
    }
}
const background = new jabaGame.Rect(ctx, 0, 0, jaba.width, jaba.height, 'rgb(66, 135, 245)')
let plys = [
    { name: "Alice", score: 50 },
    { name: "Bob", score: 70 },
    { name: "Charlie", score: 60 }
];
plys.sort((a, b) => a.score - b.score);
console.log(plys);


let player = {};
player.health = 0;
socket.on('connect', ()=> {
    //testing features;

    //menu stuff
    socket.on('playerData', playerData=>{
        player = new Player(ctx, playerData);
    })
    socket.on('respawnUpdate', playerRect=>{
        player.position.x = playerRect.x;
        player.position.y = playerRect.y;
    })
    document.getElementById('play').addEventListener('click', ()=>{
        if (player.name){
            document.getElementById('main-menu').style.display = 'none';
            player.health = 100;
            socket.emit('respawnRequest', '')
        }
    })
    //player
    let players = [];
    let scorelist = [];



    //game stuff
    socket.on('getPlayersResponse', playersData=>{
        let i = 1;
        players = playersData;

        //score list
        scorelist = [];
        for (const [key, opponent] of Object.entries(players)) {
            if (opponent.name){
                let text = new jabaGame.Text(ctx, 3,  40 + 30 * i,  opponent.name + " " + opponent.kills + ' kills', 20, 'black');
                i++
                scorelist.push({'text':text, 'kills':opponent.kills})
            }
            // console.log(sorted)

        }
        // console.log('__________________________')
        // console.log(scorelist)
        // scorelist = scorelist.sort((a, b) => a.kills - b.kills);
        // console.log(scorelist)
    });
    socket.on('healthUpdate', collisionData=>{
        if (collisionData.id === socket.id){
            player.health = collisionData.playerHealth;
        }else {
            players[socket.id].health = collisionData.playerHealth;
        }
    })


    //game loop
    let then = Date.now();
    let now;
    let tick = 0;
    let fps = 60;
    function animate(){
        //time handler
        now = Date.now();
        let difference = now - then;
        if (difference > 1000 / fps){
            background.draw()
            grassTiles.map(tile=>{tile.drawImageRelative(ctx, jaba.cameraPosition)})

            // handle other players

            //render players
            Object.keys(players).forEach(id=>{
                console.log(players)
                if (id !== socket.id && players[id].stats.health > 0){
                    let pos = players[id].rect;
                    const opponent = new jabaGame.Rect(ctx, pos.x + jaba.cameraPosition.x, pos.y + jaba.cameraPosition.y, 30, 30, pos.color);
                    const opSkin = new jabaGame.Image(ctx, 'walt', pos.x, pos.y, 30, 30);

                    //health and name
                    let healthBarWidth = 75;
                    const playerName = new jabaGame.Text(ctx, pos.x + jaba.cameraPosition.x - 20, pos.y + jaba.cameraPosition.y -30, players[id].name, '15', 'black')
                    const opponentHealthBackground = new jabaGame.Rect(ctx, pos.x + jaba.cameraPosition.x - 20, pos.y + jaba.cameraPosition.y - 20, healthBarWidth, 10, 'red');
                    const opponentHealthProgress = new jabaGame.Rect(ctx, pos.x + jaba.cameraPosition.x - 20, pos.y + jaba.cameraPosition.y - 20, healthBarWidth * players[id].stats.health / 100, 10, 'rgb(24,255,0)');

                    //draw
                    opponent.draw()
                    opSkin.drawImageRelative(ctx, jaba.cameraPosition)
                    opponentHealthBackground.draw()
                    opponentHealthProgress.draw()
                    playerName.draw()
                }
            })

            scorelist.map(score=>{score.text.draw()})

            socket.emit('getPlayers', socket.id)
            if (player.health > 0){
                player.main(jaba, player.position, socket, bulletsHandler, tick);
                player.respawnState = true;
            }else if(player.respawnState){
                socket.emit('respawnRequest', '')
                player.respawnState = false;
                player.respawn(jaba)
            }
            bulletsHandler.drawBullets(socket, jaba, player, players)


            //updating vars
            tick++
            if (jaba.cameraPosition){
                jaba.cameraPosition = {'x':jaba.width/2 - player.position.x, 'y':jaba.height/2 - player.position.y};
            }
            jaba.tick = tick;
            then = now;
        }
        requestAnimationFrame(animate);
    }
    animate();


})
