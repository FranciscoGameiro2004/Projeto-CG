const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

const componentProperties = document.querySelector('#componentProperties')

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

var squareCheck = null
var originalPosX = 0
var originalPosY = 0
var boxGrabbed = null

class gridBlock {
    constructor(posX, posY, Width, Height) {
        this.x = posX;
        this.y = posY;
        this.width = Width;
        this.height = Height;
        this.mouseOver = false;
        this.available = true;
        this.item=null;
    }

    draw() 
    {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'cyan';
        ctx.lineWidth = 1;
        if (this.mouseOver) {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
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
    constructor(posX,posY, Width,Height, color=null, img=null,item) {
        this.x = posX
        this.y = posY

        this.xLock = null
        this.yLock = null

        this.color = color
        this.img = img
        this.item = item

        this.prevX = posX
        this.prevY = posY

        this.w = Width
        this.h = Height

        this.grab = false
        this.onGrid = false

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
        if (this.grab){
            this.x -= (this.prevX - e.offsetX)
            this.y -= (this.prevY - e.offsetY)
        }

        this.prevX = e.offsetX
        this.prevY = e.offsetY
    }

    grabStatus(e){
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

let buttons = new Array()
menuBtn = new Button(W/2-65,H/4*3, 130,50, 'Começar', 1)

let boxes = new Array()
let colors = [null, null, null, null, 'red']
let compImg = [battery, bulbOff, resistor, switchOn, null]
let designation = ['Battery', 'Bulb','Resistor','Switch','Wire']
for (let i = 0; i < 5; i++)
{
    boxes.push(new Box(18 + i * 100, 400, 50, 50, colors[i], compImg[i], designation))
}

let squareGrid = new Array();
for (let i = 0; i < gridSize; i++) 
{
    for (let j = 0; j < gridSize; j++) {
        squareGrid.push(new gridBlock(padding + pixelSizeX * j, padding + pixelSizeY * i, pixelSizeX, pixelSizeY));
    }
}
//console.log(squareGrid[0]);
//console.log(squareGrid[squareGrid.length -1])

xInit = squareGrid[0].x; xEnd = squareGrid[squareGrid.length -1].x + pixelSizeX; //console.log(`x vai de ${xInit} até ${xEnd}`);
yInit = squareGrid[0].y; yEnd = squareGrid[squareGrid.length -1].y + pixelSizeY; //console.log(`y vai de ${yInit} até ${yEnd}`);

canvas.addEventListener('mousemove', (e) => 
{
    //console.clear()
    let flag = true
    squareGrid.forEach(square => 
    {
        let check = square.checkHover(e)
        if (flag) 
        {
            if (check)
            {
                boxes.forEach(box => 
                {
                    if (box.grab)
                    {
                        //console.log(`${square.available} | ${check}`)
                        
                        box.xLock = check[0]; 
                        box.yLock = check[1];
                        
                    }
                });
                flag = false
            } 
            else 
            {
                boxes.forEach(box => 
                {
                    if (box.grab)
                    {
                        box.xLock = null
                        box.yLock = null
                    }
                });
            }
        }
        
        //console.log(check);
    });
    boxes.forEach(box => {
        box.move(e)
    });
})

canvas.addEventListener('mousedown', (e) => 
{
    boxes.forEach(box => 
    {  
        if (boxes.every(box => !box.grab))
        {
            box.grabStatus(e)
            boxGrabbed = boxes[boxes.findIndex( box => box.grab == true)];//console.log(boxGrabbed)
            if (box.grab == true)
            {
                originalPosX = boxGrabbed.x
                originalPosY = boxGrabbed.y
                
            }
            squareGrid.forEach( square => 
            {
                let check = square.checkHover(e)
                if(box.grab == true && check)
                {
                    let check = square.checkHover(e);//console.log(check);
                    if (check != null)
                    {
                        squareCheck = squareGrid[`${squareGrid.findIndex( square => square.x == check[0] && square.y == check[1])}`];
                    }
                    squareGrid[`${squareGrid.findIndex( square => square.x == check[0] && square.y == check[1])}`].available = true
                    squareCheck.item=null
                }
            })
        }
    });

})

canvas.addEventListener('mouseup', (e) =>
{
    boxes.forEach(box =>
    {
        if (box.grabStatus)
        {
            squareGrid.forEach(square => 
            {
                let check = square.checkHover(e);//console.log(check);
                if (check != null)
                {
                    squareCheck = squareGrid[`${squareGrid.findIndex( square => square.x == check[0] && square.y == check[1])}`];
                }
                let boxGrabbed = boxes[`${boxes.findIndex(box => box.grab == true)}`]


                if (box.grab == true && check)
                {
                    if (squareCheck.available == true)
                    {
                        box.lockStatus()
                        //console.log(`${squareGrid.findIndex( square => square.x == check[0] && square.y == check[1])}`)
                        squareCheck.available = false
                        squareCheck.item = box.item
                    }
                    else if(squareCheck.available == false)
                    {
                        boxGrabbed.x=originalPosX
                        boxGrabbed.y=originalPosY
                        if(squareGrid[`${squareGrid.findIndex( square => square.x == originalPosX && square.y == originalPosY)}`] != undefined)
                        {
                            squareGrid[`${squareGrid.findIndex( square => square.x == originalPosX && square.y == originalPosY)}`].available = false;
                        }                   
                    }
                }
            })
            box.grab = false
            generateTable()
        }
    })

    /*
    boxes.forEach(box => 
    {
        box.grab = false
        box.lockStatus()

    });
    */

})


canvas.addEventListener("click", (e) => 
{
    //console.clear()
    if (e.ctrlKey) {
        squareCheck = null
        squareGrid.forEach(square => 
        {
            let check = square.checkHover(e)
            if (check != null)
            {
                squareCheck = squareGrid[`${squareGrid.findIndex( square => square.x == check[0] && square.y == check[1])}`];
            }
        })
        if (squareCheck != null)
        {
            console.table(squareCheck)
        }
    }
})


function drawMenu(){
    ctx.fillStyle = 'black'
    ctx.font = '30px Arial Black'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Construção de um Circuito', W/2, H/4)
    
    menuBtn.draw()
}

canvas.addEventListener('click', e =>{
    menuBtn.click(e)
})

setInterval(() => 
{
    ctx.clearRect(0, 0, W, H);
    if (phase != 0) {
        if (phase == 1){
            tutorialText = 'Coloque os componentes nas suas áreas'
        } else if (phase == 2){
            tutorialText = 'Conecte os componentes'
        } else {
            tutorialText = ''
        }
        generateText(tutorialText, W/2, 75)
        squareGrid.forEach(square => {
            square.draw();
        });
        boxes.forEach(box => {
            box.draw()
        });
    } else {
        drawMenu()

    }
    if (phase < 3) {
        componentProperties.style.visibility = 'collapse'
    } else {
        componentProperties.style.visibility = 'visible'
    }
}, 1);

function generateTable() 
{
    let tbl = document.getElementById("tabela");//console.log(tbl);
    if (tbl.innerHTML != "")
    {
        tbl.innerHTML = ""
    }

    
    // creates a <table> element and a <tbody> element
    //const tblBody = document.createElement("tbody");
    //console.log(squareGrid)
    let repeat = Math.sqrt(squareGrid.length)

    // creating all cells
    for (let i = 0; i < repeat; i++) 
    {
        // creates a table row
        const row = document.createElement("tr");

        for (let j = 0; j < repeat; j++) 
        {
            let tblAvailable = squareGrid[`${squareGrid.findIndex( square => square.x == (padding + pixelSizeX * j) && square.y == (padding + pixelSizeY * i))}`];//console.log(tblAvailable)
            const cell = document.createElement("td");
            if (tblAvailable.available == true)
            {
                cell.style.backgroundColor = "green"
            }
            else if (tblAvailable.available == false)
            {
                cell.style.backgroundColor = "red"

            }
            cell.style.width = (100) + "px"
            cell.style.height = (50) + "px"
            row.appendChild(cell);
        }

        // add the row to the end of the table body
        tbl.appendChild(row);
    }
        tbl.setAttribute("border", "2");
}

function generateText(text, x,y){
    ctx.fillStyle = 'black'
    ctx.font = '20px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, x, y)
}

function generatePath()
{
    let local = null
    local = squareGrid.findIndex( square => square.item == "battery"); console.log(local)

    if( squareGrid[local - 5].item == "wire")
    {
        console.log("cima")
    }
    if( squareGrid[local - 1].item == "wire")
    {
        console.log("esquerda")
    }
    if( squareGrid[local + 1].item == "wire")
    {
        console.log("direita")
    }
    if( squareGrid[local + 5].item == "wire")
    {
        console.log("baixo")
    }
}

generateTable()
console.clear()
