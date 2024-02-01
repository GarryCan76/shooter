import * as jabaGame from './jabagame1-1.js';

export default class Player{
    constructor(ctx, position) {
        this.ctx = ctx;
        this.position = {'x':0, 'y':0};
        this.color = 'blue';
        this.playerRect = new jabaGame.Rect(ctx, position.x, position.y, 30, 30, this.color)
        this.shotDelay = 0;
        this.health = 100;
    }

    createRect(){
        this.playerRect = new jabaGame.Rect(this.ctx, this.position.x, this.position.y, 30, 30, this.color);
    }

    main(jaba, position, socket, bulletsHandler, tick){
        this.move(jaba.keysDown(), position, socket)
        this.playerRect.x = jaba.width / 2;
        this.playerRect.y = jaba.height / 2;
        this.playerRect.draw();
        if(jaba.mouseButtonDown()[0] && this.shotDelay + 15 < tick){
            this.shotDelay = tick;
            bulletsHandler.createBullet(jaba, socket, position)
        }

        this.healthHandler(jaba)

        return position;
    }

    healthHandler(jaba){
        let healthBarRect = new jabaGame.Rect(jaba.ctx, 0, 0, 100, 30, 'green')

        healthBarRect.draw()

    }

    move(keysDown, position, socket){
        let speed = 10;
        let pressed = false;
        //w
        if (keysDown['87']){
            position.y -= speed;
            pressed = true;
        }
        //s
        if (keysDown['83']){
            position.y += speed;
            pressed = true;
        }
        //a
        if (keysDown['65']){
            position.x -= speed;
            pressed = true;
        }
        //d
        if (keysDown['68']){
            position.x += speed;
            pressed = true;
        }
        if (pressed){
            socket.emit('playerMove', position);
        }
        return position;
    }


}