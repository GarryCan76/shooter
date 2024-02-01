import * as jabaGame from './js/jabagame1-1.js';
import BulletsHandler from "./js/bulletsHandler.js";
import Player from "./js/player.js";

const socket = io();

let canvas = document.getElementById('canvas');
const body = document.body;
canvas.width = body.offsetWidth;
canvas.height = body.offsetHeight;

let position = {'x':0, 'y':0};
const ctx = canvas.getContext("2d");
let jaba = new jabaGame.Init(canvas, ctx);

//player
let player = new Player(ctx, position);
let players = [];

//bulletsHandler
let bulletsHandler = new BulletsHandler(jaba, socket);

const object = new jabaGame.Rect(ctx, 200 + jaba.cameraPosition.x, 200 + jaba.cameraPosition.y, 30, 30, 'green')
const background = new jabaGame.Rect(ctx, 0, 0, jaba.width, jaba.height, 'white')

socket.on('connect', ()=> {
    socket.on('getPlayersResponse', playersData=>{
        players = playersData;
    });
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

            Object.keys(players).forEach(id=>{
                if (id !== socket.id){
                    let pos = players[id];
                    const p = new jabaGame.Rect(ctx, pos.x + jaba.cameraPosition.x, pos.y + jaba.cameraPosition.y, 30, 30, 'red');

                    p.draw()
                }
            })
            socket.emit('getPlayers', socket.id)
            object.x = 100 + jaba.cameraPosition.x;
            object.y = 100 + jaba.cameraPosition.y;
            position = player.main(jaba, position, socket, bulletsHandler, tick)
            bulletsHandler.drawBullets(jaba, player)
            object.draw()

            //updating vars
            tick++
            jaba.cameraPosition = {'x':jaba.width/2 - position.x, 'y':jaba.height/2 - position.y};
            jaba.tick = tick;
            then = now;
        }
        requestAnimationFrame(animate);
    }
    animate();


})
