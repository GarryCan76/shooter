import * as jabaGame from './jabagame1-1.js'

export default class BulletsHandler {
    constructor(jaba, socket) {
        this.playerBullets = [];
        socket.on('sendBullet', bullet=>{
            this.pushBullet(jaba, bullet)
        })
    }
    createBullet(jaba, socket, position){
        let bullet = {'position': {"x":position.x,"y":position.y}, 'target':{'x':jaba.mousePos().x - jaba.cameraPosition.x, 'y':jaba.mousePos().y - jaba.cameraPosition.y} , 'velocity': 5};
        // console.log(jabaGame.lerp({'x':0, 'y':0}, {'x':100, 'y':435}, 5))
        bullet['angle'] = jabaGame.lerp(bullet.position, bullet.target, 10);
        socket.emit('newBullet', bullet)
        this.pushBullet(jaba, bullet)
    }
    pushBullet(jaba, bullet){
        const lifespan = 40;
        let bulletRect = new jabaGame.Rect(jaba.ctx, bullet.position.x, bullet.position.y, 10, 10, 'purple')
        bullet['bulletRect'] = bulletRect;
        bullet['lifeSpan'] = jaba.tick + lifespan;
        this.playerBullets.push(bullet)
    }


    drawBullets(jaba, player){
        this.playerBullets.map(bullet=>{
            let bulletCollision = {'x':bullet.position.x + jaba.cameraPosition.x,'y':bullet.position.y + jaba.cameraPosition.y,'width':bullet.bulletRect.width,'height':bullet.bulletRect.height};
            bullet.position.x += bullet.angle.x;
            bullet.position.y += bullet.angle.y;
            bullet.bulletRect.x = bullet.position.x + jaba.cameraPosition.x;
            bullet.bulletRect.y = bullet.position.y + jaba.cameraPosition.y;

            console.log(player.playerRect)
            console.log(bullet.bulletRect)
            if (player.playerRect.collideRect(bulletCollision)){
                console.log('hit')
            }

            bullet.bulletRect.draw()
        })

        if (this.playerBullets[0] && this.playerBullets[0].lifeSpan < jaba.tick){
            this.playerBullets.shift()
        }
    }

}