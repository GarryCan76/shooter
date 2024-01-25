import * as jabaGame from './jabagame.js';
import Player from './player.js';
const canvas = document.getElementById('Canvas');
const ctx = canvas.getContext("2d");

let jaba = new jabaGame.Init(canvas);
let player = new Player(ctx, 200, 200, jaba)

//game loop
let then = Date.now();
let now;
let count = 0;
let fps = 30;

Math.atan2(100, 200)


function animate(){
    //time handler
    now = Date.now();
    let difference = now - then;
    if (difference > 1000 / fps){
        count++
        player.draw(jaba.mousePos())




        then = now;
    }
    requestAnimationFrame(animate);
}
animate();

