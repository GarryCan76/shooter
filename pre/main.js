import * as jabaGame from './jabagame1-1.js';
import Player from './player.js';
const canvas = document.getElementById('Canvas');
const ctx = canvas.getContext("2d");

let jaba = new jabaGame.Init(canvas, ctx);
let player = new Player(ctx, 250, 250, jaba);
const background = new jabaGame.Rect(ctx, 0, 0, canvas.width, canvas.height, "white")

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
        count++

        background.draw()

        ctx.fillStyle =  "white";
        player.draw(jaba.mousePos())


        then = now;
    }
    requestAnimationFrame(animate);
}
animate();

