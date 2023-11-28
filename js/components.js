var squareGrid = []

class gridBlock {
    constructor(posX, posY, Width, Height, img=null) {
        this.x = posX;
        this.y = posY;
        this.width = Width;
        this.height = Height;
        this.mouseOver = false;
        this.available = true;
        this.item=null;
        this.img=img;
    }

    draw() 
    {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'cyan';
        ctx.lineWidth = 1;
        if (this.mouseOver) {
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.globalAlpha = 0.9
        } else {
            ctx.globalAlpha = 0.35;
        }
        if (this.img != null && this.img != undefined){
            ctx.drawImage(this.img, this.x,this.y, this.width,this.height);
        }
        ctx.globalAlpha = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    checkHover(mouse)
    {
        let x = mouse.offsetX; 
        let y = mouse.offsetY; 
        //console.log(x, y);

        if (
            x > this.x &&
            x < this.x + this.width &&
            y > this.y && 
            y < this.y + this.height
            )
        {
            this.mouseOver = true
            return [this.x, this.y]
        } else {
            this.mouseOver = false
            return null
        }
    }

}

for (let i = 0; i < gridSize; i++) 
{
    for (let j = 0; j < gridSize; j++) {
        image = ''
        try {
            let imgIndex = boxes.find(box => box.correctX == padding + pixelSizeX * j && box.correctY == padding + pixelSizeY * i)
            image = imgIndex.img
        } catch (error) {
            image = null
        }
        squareGrid.push(new gridBlock(padding + pixelSizeX * j, padding + pixelSizeY * i, pixelSizeX, pixelSizeY, img=image));
    }
}

xInit = squareGrid[0].x; xEnd = squareGrid[squareGrid.length -1].x + pixelSizeX; //console.log(`x vai de ${xInit} até ${xEnd}`);
yInit = squareGrid[0].y; yEnd = squareGrid[squareGrid.length -1].y + pixelSizeY; //console.log(`y vai de ${yInit} até ${yEnd}`);

class Box{
    constructor(posX,posY, Width,Height, color=null, img=null,item, correctX=undefined, correctY=undefined) {
        this.x = posX
        this.y = posY

        this.xLock = null
        this.yLock = null

        this.correctX = correctX
        this.correctY = correctY

        this.color = color
        this.img = img
        this.item = item

        this.prevX = posX
        this.prevY = posY

        this.w = Width
        this.h = Height

        this.grab = false
        this.onGrid = false

        this.doesMove = true
    }

    draw(){
        if (this.color){
            ctx.fillStyle = this.color
        } else {
            ctx.fillStyle = 'rgba(0,0,0,0)'
        }
        ctx.fillRect(this.x,this.y, this.w,this.h)
        if (this.img != null){
            ctx.drawImage(this.img, this.x,this.y, this.w,this.h);
        }
    }

    move(e){
        if (this.doesMove){
            if (this.grab){
                this.x -= (this.prevX - e.offsetX)
                this.y -= (this.prevY - e.offsetY)
            }
    
            this.prevX = e.offsetX
            this.prevY = e.offsetY
        }
    }

    grabStatus(e){
        if (this.doesMove){
            let X = e.offsetX; let Y = e.offsetY
            if (
                X > this.x && 
                X < this.x + this.w && 
                Y > this.y && 
                Y < this.y + this.h
                )
            {
                this.grab = true
            }
        }
        
    }

    lockStatus()
    {
        if (this.xLock && this.yLock)
        {
            this.x = this.xLock
            this.y = this.yLock
            
            this.xLock = null
            this.yLock = null

            this.onGrid = true
        }

    }

    get correctPlace() {
        if (this.correctX && this.correctY) {
            return this.x == this.correctX && this.correctY == this.y
        }
        return false
    }
}
var boxes = [];

class Button{
    constructor(x,y, w,h, text, phase) {
        this.x = x
        this.y = y

        this.w = w
        this.h = h

        this.phase = phase

        this.text = text

        this.appear = true
    }

    draw(){
        if (this.appear){
            ctx.fillRect(this.x,this.y, this.w,this.h)
            ctx.fillStyle = 'white'
            ctx.font = '30px Arial'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(this.text, this.x + this.w/2, this.y + this.h/2)
            ctx.fillStyle = 'black'
        }
    }

    click(e){
        if (e.offsetX > this.x && e.offsetX < this.x + this.w && e.offsetY > this.y && e.offsetY < this.y + this.h){
            this.appear = false
            phase = this.phase
            canvas.removeEventListener('click', e=>{
                menuBtn.click(e)
            })
        }
    }
}
var buttons = [];

class Point {
    constructor(x,y){
        this.X = x;
        this.Y = y;
        this.Radius = 10;
        this.Start = 0;
        this.End = 2 * Math.PI
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.X, this.Y, this.Radius, this.Start, this.End);
        ctx.fillStyle = "black"
        ctx.fill();
    }
}
var points = [];

