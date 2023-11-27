const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

let pointIL = {x:0, y:0}
let pointIR = {x:0, y:0}
let pointSL = {x:0, y:0}
let pointSR = {x:0, y:0}

const componentProperties = document.querySelector('#componentProperties')

let genPathFlag = true
let addWires = true
let phase = 0
let tutorialText = ''
let padding = 125

const gridSize = 5;
const pixelSizeX = 250 / gridSize;
const pixelSizeY = 250 / gridSize;
var xInit = 0; var xEnd = 0;
var yInit = 0; var yEnd = 0;

switchOn = new Image()
switchOn.src = 'assets/interruptor_aberto.png'

switchOn = new Image()
switchOn.src = 'assets/interruptor_fechado.png'

battery = new Image()
battery.src = 'assets/pilha.png'

bulbOn = new Image()
bulbOn.src = 'assets/lampada_acesa.png'

bulbOff = new Image()
bulbOff.src = 'assets/lampada_desligada.png'

bulbOn = new Image()
bulbOn.src = 'assets/lampada_acesa.png'

resistor = new Image()
resistor.src = 'assets/resistencia.png'

wireSL = new Image()
wireSL.src = 'assets/fioSE.png'

wireSR = new Image()
wireSR.src = 'assets/fioSD.png'

wireIL = new Image()
wireIL.src = 'assets/fioIE.png'

wireIR = new Image()
wireIR.src = 'assets/fioID.png'

var squareCheck = null
var originalPosX = 0
var originalPosY = 0
var boxGrabbed = null
var Start = true
var oldPathData = null
var actualPathData = null
var oldLocal = null
var local = null
var batteryEnd = false

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
let points = new Array

let buttons = new Array()
menuBtn = new Button(W/2-65,H/4*3, 130,50, 'Começar', 1)

let boxes = new Array()
let colors = [null, null, null, null, 'red', 'red', 'red']
let compImg = [battery, bulbOff, resistor, switchOn, null, null, null]
let designation = ['Battery', 'Bulb','Resistor','Switch','Wire','Wire','Wire']

generateBoxComponents()

let squareGrid = new Array();
for (let i = 0; i < gridSize; i++) 
{
    for (let j = 0; j < gridSize; j++) {
        let image = ''
        try {
            let imgIndex = boxes.find(box => box.correctX == padding + pixelSizeX * j && box.correctY == padding + pixelSizeY * i)
            image = imgIndex.img
        } catch (error) {
            image = null
        }
        squareGrid.push(new gridBlock(padding + pixelSizeX * j, padding + pixelSizeY * i, pixelSizeX, pixelSizeY, img=image));
    }
}
//console.log(squareGrid[0]);
//console.log(squareGrid[squareGrid.length -1])

xInit = squareGrid[0].x; xEnd = squareGrid[squareGrid.length -1].x + pixelSizeX; //console.log(`x vai de ${xInit} até ${xEnd}`);
yInit = squareGrid[0].y; yEnd = squareGrid[squareGrid.length -1].y + pixelSizeY; //console.log(`y vai de ${yInit} até ${yEnd}`);

console.clear()

setInterval(() => 
{
    ctx.clearRect(0, 0, W, H);
    if (phase == 1){
        tutorialText = 'Coloque os componentes nas suas áreas'
        checkRequirements(boxes)
    } else if (phase == 2){
        tutorialText = 'Conecte os componentes'
        if (addWires){
            //alert('ok')
            generateBoxWires()
            addWires = false
        }
        checkRequirements(boxes)
        //TODO: colocar um checkRequirements para um array de fios
    } else if (phase == 3){
        tutorialText = ''
        //generatePath()
    }
    generateText(tutorialText, W/2, 75)
    squareGrid.forEach(square => {
        square.draw();
    });
    boxes.forEach(box => {
        box.draw()
    });
    points.forEach(point => {
        point.draw()
    });
    if (phase < 3) {
        componentProperties.style.visibility = 'collapse'
    } else {
        componentProperties.style.visibility = 'visible'
    }

    try {
        animateElectrons()
    } catch (error) {
        
    }
}, 1);