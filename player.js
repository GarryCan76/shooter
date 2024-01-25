import * as jabaGame from "./jabagame.js";
import Bullet from "./bullet.js";

export default class Player{
    constructor(ctx, x, y) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.bullets = [];
        this.mouse = false;

        this.rect = new jabaGame.Rect(ctx, x, y, 20, 20, "green")
        addEventListener('click', ()=>{this.createBullet()})


    }

    draw(mouse){
        this.rect.draw()
        this.mouse = mouse;

        this.bullets.map(bullet=>bullet.draw())
    }

    createBullet(){
        console.log(this.mouse)
        this.bullets.push(new Bullet(this.ctx, this.rect.center()))
    }

}