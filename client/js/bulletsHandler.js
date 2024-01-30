import * as jabaGame from './jabagame1-1.js'

export default class BulletsHandler {
    constructor(jaba, socket) {
        this.playerBullets = [];
        socket.on('sendBullet', bullet=>{
            this.receiveBullet(jaba, bullet)
        })
    }
    createBullet(jaba, socket, position){
        let bullet = {'position': {"x":position.x,"y":position.y}, 'target':{'x':jaba.mousePos().x - jaba.cameraPosition.x, 'y':jaba.mousePos().y - jaba.cameraPosition.y} , 'velocity': 5};
        // console.log(jabaGame.lerp({'x':0, 'y':0}, {'x':100, 'y':435}, 5))
        let bulletRect = new jabaGame.Rect(jaba.ctx, bullet.position.x, bullet.position.y, 10, 10, 'purple');
        bullet['angle'] = jabaGame.lerp(bullet.position, bullet.target, 5);
        socket.emit('newBullet', bullet)
        bullet['bulletRect'] = bulletRect;
        this.playerBullets.push(bullet)
    }
    receiveBullet(jaba, bullet){
        let bulletRect = new jabaGame.Rect(jaba.ctx, bullet.position.x, bullet.position.y, 10, 10, 'purple')
        bullet['bulletRect'] = bulletRect;
        this.playerBullets.push(bullet)
    }


    drawBullets(jaba){
        this.playerBullets.map(bullet=>{
            bullet.position.x += bullet.angle.x;
            bullet.position.y += bullet.angle.y;

            bullet.bulletRect.x = bullet.position.x + jaba.cameraPosition.x
            bullet.bulletRect.y = bullet.position.y + jaba.cameraPosition.y
            bullet.bulletRect.draw()
        })
    }

}