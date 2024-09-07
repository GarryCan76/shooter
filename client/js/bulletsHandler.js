import * as jabaGame from './jabagame1-1.js'

export default class BulletsHandler {
    constructor(jaba, socket) {
        this.playerBullets = [];
        socket.on('sendBullet', bullet=>{
            this.pushBullet(jaba, bullet)
        })
    }
    createBullet(jaba, socket, position, name, playerRect){
        let velocity = 20;
        let bullet = {'position': {"x":position.x + playerRect.width /2,"y":position.y + playerRect.height /2}, 'target':{'x':jaba.mousePos().x - jaba.cameraPosition.x, 'y':jaba.mousePos().y - jaba.cameraPosition.y} , 'velocity': velocity, 'name':name};
        bullet['rect'] = {'x':position.x, 'y':position.y, 'width':10, 'height':10};
        bullet['owner'] = socket.id;
        bullet['lifeSpan'] = 50;
        // console.log(jabaGame.lerp({'x':0, 'y':0}, {'x':100, 'y':435}, 5))
        bullet['angle'] = jabaGame.lerp(bullet.position, bullet.target, velocity);
        socket.emit('newBullet', bullet)
        this.pushBullet(jaba, bullet)
    }
    pushBullet(jaba, bullet){
        const birth = 40;
        bullet['bulletRect'] = new jabaGame.Rect(jaba.ctx, bullet.position.x, bullet.position.y, 10, 10, 'purple');
        bullet['birth'] = jaba.tick + birth;
        this.playerBullets.push(bullet)
    }


    drawBullets(socket, jaba, player, players){
        let i = 0;
        let removeBullets = [];
        // looping through list and grabbing indexes to delete later.
        this.playerBullets.map(bullet=>{
            i++;

            //update position of bullet
            bullet.position.x += bullet.angle.x;
            bullet.position.y += bullet.angle.y;
            bullet.bulletRect.x = bullet.position.x + jaba.cameraPosition.x;
            bullet.bulletRect.y = bullet.position.y + jaba.cameraPosition.y;


            if (socket.id === bullet.owner){
                //check if bullet collides with other players
                for (const [key, opponent] of Object.entries(players)) {
                    if (socket.id !== key){
                        this.playerBullets.forEach(bullet=>{
                            if (opponent.rect.x + opponent.rect.width > bullet.position.x && opponent.rect.x < bullet.position.x + bullet.bulletRect.width && opponent.rect.y + opponent.rect.height > bullet.position.y && opponent.rect.y < bullet.position.y + bullet.bulletRect.height){
                                removeBullets.push(bullet.name)
                            }
                        })
                    }
                }
            }else {
                //check if bullet collides with player
                if (player.playerRect.collideRect(bullet.bulletRect.rect())){
                    if (bullet.name !== player.name){
                        removeBullets.push(bullet.name)
                        player.color = 'purple';
                        player.createRect()
                    }
                }
            }

            //kill bullet when to old
            if (bullet && bullet.birth < jaba.tick){
                removeBullets.push(bullet.name)
            }

            bullet.bulletRect.draw()
        })

        //remove bullets from list
        removeBullets.map(bulletName=>{
            this.playerBullets = this.playerBullets.filter(bullet=>bullet.name !== bulletName);
            console.log('deleted')
        })
    }

}