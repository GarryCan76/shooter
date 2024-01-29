import * as jabaGame from './js/jabagame1-1.js';

import Player from "./js/player.js";
const socket = io();

let canvas = document.getElementById('canvas');
const body = document.body;
canvas.width = body.offsetWidth;
canvas.height = body.offsetHeight;

let position = {'x':0, 'y':0};
const ctx = canvas.getContext("2d");
let jaba = new jabaGame.Init(canvas, ctx);
let player = new Player(ctx, position);
let players = [];
let cameraPosition = {'x':jaba.width/2, 'y':jaba.height/2};

console.log(cameraPosition)
const object = new jabaGame.Rect(ctx, 200 + cameraPosition.x - position.x, 200 + cameraPosition.y - position.y, 30, 30, 'green')
const background = new jabaGame.Rect(ctx, 0, 0, jaba.width, jaba.height, 'white')

socket.on('connect', ()=> {
    socket.on('getPlayersResponse', playersData=>{
        players = playersData;
    })

    //game loop
    let then = Date.now();
    let now;
    let count = 0;
    let fps = 30;
    function animate(){
        //time handler
        now = Date.now();
        let difference = now - then;
        if (difference > 1000 / fps){
            background.draw()

            Object.keys(players).forEach(id=>{
                if (id !== socket.id){
                    let pos = players[id];
                    const p = new jabaGame.Rect(ctx, pos.x + cameraPosition.x - position.x, pos.y + cameraPosition.y - position.y, 30, 30, 'red');
                    console.log(pos.x)
                    p.draw()
                }
            })
            socket.emit('getPlayers', socket.id)
            count++
            object.x = 200 + cameraPosition.x - position.x;
            object.y = 200 + cameraPosition.y - position.y;

            object.draw()
            position = player.main(jaba, position, socket)
            then = now;
        }
        requestAnimationFrame(animate);
    }
    animate();


})
