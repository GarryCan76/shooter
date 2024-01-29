import * as jabaGame from './jabagame1-1.js';

export default class Player{
    constructor(ctx, position) {
        this.ctx = ctx;
        this.position = {'x':0, 'y':0};
        this.playerRect = new jabaGame.Rect(ctx, position.x, position.y, 30, 30, 'blue')
    }

    main(jaba, position, socket){
        this.move(jaba.keysDown(), position, socket)

        this.playerRect.x = jaba.width / 2;
        this.playerRect.y = jaba.height / 2;
        this.playerRect.draw()


        return position;
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