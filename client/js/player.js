import * as jabaGame from './jabagame1-1.js';

export default class Player{
    constructor(ctx, playerData) {
        let rect = playerData.rect;
        this.name = Math.floor(Math.random() * 1000)
        this.ctx = ctx;
        this.position = {'x':rect.x, 'y':rect.y};
        this.color = 'blue';
        this.playerRect = new jabaGame.Rect(ctx, rect.x, rect.y, rect.width, rect.height, 'blue')
        this.shotDelay = 0;
        this.health = playerData.health
        this.name = playerData.name;
        this.respawnState = true;
    }

    createRect(){
        this.playerRect = new jabaGame.Rect(this.ctx, this.position.x, this.position.y, 30, 30, 'blue');
    }

    main(jaba, position, socket, bulletsHandler){
        this.move(jaba.keysDown(), position, socket)
        this.playerRect.x = jaba.width / 2;
        this.playerRect.y = jaba.height / 2;
        this.playerRect.draw();


        //when click player shoot
        if(jaba.mouseButtonDown()[0] && this.shotDelay + 1 < jaba.tick){
            this.shotDelay = jaba.tick;
            bulletsHandler.createBullet(jaba, socket, position, Math.floor(Math.random() * 10000), this.playerRect)
        }

        this.healthHandler(jaba)

        return position;
    }

    healthHandler(jaba){
        let healtbarWidth = 300;
        let healthBarBackground = new jabaGame.Rect(jaba.ctx, 0, 0, healtbarWidth, 30, 'red');
        let healthBarProgress = new jabaGame.Rect(jaba.ctx, 0, 0, healtbarWidth * this.health/100, 30, 'rgb(24,255,0)');
        let healthNum = new jabaGame.Text(jaba.ctx, 0, 25, this.health+'/'+100, 20, 'black');
        healthBarBackground.draw()
        healthBarProgress.draw()
        healthNum.draw()

    }

    respawn(jaba){
        jaba.socket.emit('playerMove', {'name':this.name, 'rect':{'x':this.position.x, 'y':this.position.y, 'width':this.playerRect.width, 'height':this.playerRect.height, 'color':'purple'}});
    }

    move(keysDown, position, socket){
        let speed = 3;
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
            // socket.emit('playerMove', {'name':this.name, 'rect':{'x':position.x, 'y':position.y, 'width':this.playerRect.width, 'height':this.playerRect.height, 'color':'purple'}});
            socket.emit('playerInput', keysDown);
        }
        return position;
    }


}