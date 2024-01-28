import * as jabaGame from './jabagame1-1.js';

export default class Bullet{
    constructor(jaba, position, target) {
        this.x = position.x;
        this.y = position.y;
        this.ctx = jaba.ctx;
        this.jaba = jaba;

        this.bulletRect = new jabaGame.Rect(this.ctx, this.x, this.y, 10, 10, 'blue');
        this.target = target;
        const velocity = 20;
        this.velocity = jaba.lerp(position, target, velocity)
        console.log(this.velocity)
    }

    draw(){
        let point = new jabaGame.Rect(this.ctx, this.target.x, this.target.y, 20, 20, 'yellow')
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.bulletRect.x = this.x;
        this.bulletRect.y = this.y;
        this.bulletRect.draw()
        point.draw()
    }
}