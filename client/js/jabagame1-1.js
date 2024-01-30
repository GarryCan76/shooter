let keysDown;
let mousePos = {x:0, y:0};
let mouseDown = [0, 0, 0]
export class Init{
    constructor(canvas, ctx) {
        keysDown = {};
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
        this.cameraPosition = {'x':0, 'y':0};

        window.addEventListener("keydown", function (e) {
            keysDown[e.keyCode] = true;
        }, false);

        addEventListener("keyup", function (e){
            delete keysDown[e.keyCode];
        }, false);
        canvas.addEventListener("mousemove", function (evt) {
            mousePos = getMousePos(canvas, evt);
        }, false);
        function getMousePos(canvas, evt) {
            let rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }
        mouseDown = [false, false, false]
        document.body.onmousedown = function(evt) {
            mouseDown[evt.button] = true;
        }
        document.body.onmouseup = function(evt) {
            mouseDown[evt.button] = false;
        }
    }


    keysDown(){return keysDown}
    mousePos(){return mousePos}
    mouseButtonDown(){return mouseDown}
}
export function lerp(position, target, velocity){
    const angle = Math.atan2(target.y - position.y, target.x - position.x);
    return {
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity
    }
}

export class Rect{
    constructor(surface, x, y, width, height, color) {
        this.surface = surface;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    draw(){
        this.surface.fillStyle = this.color;
        this.surface.fillRect(this.x, this.y, this.width, this.height)
    }
    rect(){
        return [this.x, this.y, this.width, this.height]
    }
    collideRect(rect){
        return this.x + this.width > rect[0] && this.x < rect[0] + rect[2] && this.y + this.height > rect[1] && this.y < rect[1] + rect[3];
    }
    collidePoint(x, y){
        return this.x < x && this.y < y && this.x + this.width > x && this.y + this.width > y;
    }
    center(){
        return {'x':this.x + this.width / 2, 'y':this.y + this.height / 2}
    }
}
export class Text{
    constructor(surface, x, y, text, fontSize, color) {
        this.surface = surface;
        this.x = x;
        this.y = y;
        this.text = text;
        this.fontSize = fontSize;
        if (!color) {
            color = "black"
        }
        this.color = color;
    }
    draw(){
        this.surface.font = this.fontSize+"px serif";
        this.surface.fillStyle = this.color;
        this.surface.fillText(this.text, this.x, this.y);
    }
}
export class Image{
    constructor(surface, imageId) {
        this.image = document.getElementById(imageId)
    }
    drawImage(surface, x, y, width, height){
        if (width === undefined){
            surface.drawImage(this.image, x, y)
        }else {
            surface.drawImage(this.image, x, y, width, height)
        }
    }
}