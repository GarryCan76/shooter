import * as jabaGame from './jabagame1-1.js'

export default class BulletsHandler {
    constructor(jaba, socket) {
        this.playerBullets = [];
        socket.on('sendBullet', bullet=>{
            this.pushBullet(jaba, bullet)
        })
    }
    createBullet(jaba, socket, position, name){
        let bullet = {'position': {"x":position.x,"y":position.y}, 'target':{'x':jaba.mousePos().x - jaba.cameraPosition.x, 'y':jaba.mousePos().y - jaba.cameraPosition.y} , 'velocity': 5, 'name':name};
        // console.log(jabaGame.lerp({'x':0, 'y':0}, {'x':100, 'y':435}, 5))
        bullet['angle'] = jabaGame.lerp(bullet.position, bullet.target, 10);
        socket.emit('newBullet', bullet)
        this.pushBullet(jaba, bullet)
    }
    pushBullet(jaba, bullet){
        const lifespan = 40;
        bullet['bulletRect'] = new jabaGame.Rect(jaba.ctx, bullet.position.x, bullet.position.y, 10, 10, 'purple');
        bullet['lifeSpan'] = jaba.tick + lifespan;
        this.playerBullets.push(bullet)
    }


    drawBullets(jaba, player){
        let i = 0;
        let removeBullets = [];
        // looping through list and grabbing indexes to delete later.
        this.playerBullets.map(bullet=>{
            i++;
            bullet.position.x += bullet.angle.x;
            bullet.position.y += bullet.angle.y;
            bullet.bulletRect.x = bullet.position.x + jaba.cameraPosition.x;
            bullet.bulletRect.y = bullet.position.y + jaba.cameraPosition.y;

            if (player.playerRect.collideRect(bullet.bulletRect.rect())){
                if (bullet.name !== player.name){
                    removeBullets.push(i)
                    player.color = 'purple';
                    player.createRect()
                }
                if (this.playerBullets[0] && this.playerBullets[0].lifeSpan < jaba.tick){
                    removeBullets.push(i)
                }
            }

            bullet.bulletRect.draw()
        })
        removeBullets.forEach(bulletIndex=>{
            console.log(bulletIndex)
        })
    }

}