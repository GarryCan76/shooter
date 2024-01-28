import * as jabaGame from "./jabagame1-1.js";
import Bullet from "./bullet.js";

export default class Player{
    constructor(ctx, x, y, jaba) {
        this.jaba = jaba;
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.bullets = [];
        this.mouse = false;

        this.rect = new jabaGame.Rect(ctx, x, y, 20, 20, "green")
        addEventListener('click', (event)=>{this.createBullet(event)})

    }

    draw(mouse){
        this.rect.draw()
        this.mouse = mouse;

        this.bullets.map(bullet=>bullet.draw())
    }

    createBullet(event){
        console.log(this.mouse)
        // const angle = Math.atan2()
        this.bullets.push(new Bullet(this.jaba, this.rect.center(), this.mouse))
    }

}