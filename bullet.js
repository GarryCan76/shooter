import * as jabaGame from './jabagame.js';

export default class Bullet{
    constructor(ctx, position, target) {
        this.bulletRect = new jabaGame.Rect(ctx, position.x, position.y, 10, 10, 'blue')
    }

    draw(){
        this.bulletRect.draw()
    }
}