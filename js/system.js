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

switchOff = new Image()
switchOff.src = 'assets/interruptor_fechado.png'

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
/*for (let i = 0; i < 8; i++)
{
    boxes.push(new Box(0 + i * 75, 400, 50, 50, colors[i], compImg[i], designation[i], 125+50*i, 175))
}*/

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
            //generateTable()
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
            console.log(squareCheck)
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
    } else if (phase == 3) {
        tutorialText = ''
        generatePath()
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
            cell.innerHTML = squareGrid.findIndex( square => square.x == (padding + pixelSizeX * j) && square.y == (padding + pixelSizeY * i))
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

let previousPoint = null; // Mantém o ponto anterior

function path(local) 
{
    console.log("path");

    let squareCheckItem = squareData(local); console.log(squareCheckItem[0]);

    oldPathData = actualPathData;
    oldLocal = local;

    if (squareCheckItem[2] == 'Battery') 
    {
        drawPoint(squareCheckItem[0], squareCheckItem[1])
        checkDir(local)
    } 
    else 
    {
        checkDir(local)
    }

}

function drawPoint(X,Y)
{
    let pointX, pointY
    pointX = X + pixelSizeX / 2; pointY = Y + pixelSizeY / 2;
    points.push(new Point(pointX, pointY)); console.table(points);
}

var posNum = [-5,-1,5,1]
let aceptablesItems = ['Bulb','Resistor','Switch','Wire']
function checkDir(local) 
{
    for (let i = 0; i < posNum.length; i++) {
        if (squareGrid[local + posNum[i]] != undefined && aceptablesItems.includes(squareGrid[local + posNum[i]].item)) {
            actualPathData = squareData(local + posNum[i]);

            let pointX = actualPathData[0] + pixelSizeX / 2;
            let pointY = actualPathData[1] + pixelSizeY / 2;

            // Verificar se as coordenadas estão presentes no array de pontos
            let foundPoint = points.find(point => point.X === pointX && point.Y === pointY);
            if (foundPoint) 
            {
                continue
            } 
            else 
            {
                break
            }
        }
        if(squareGrid[local + posNum[i]].item == "Battery")
        {
            batteryEnd = true;
            console.log(points.map( point => ({X: point.X, Y: point.Y})))
        }
    }
}

function generatePath() 
{
    if (genPathFlag) {

        while(batteryEnd == false)
        {
        
            console.clear()
            if (Start == true) 
            {
                local = squareGrid.findIndex(square => square.item == "Battery");//console.log(local)
                Start = false;
            } 
            else 
            {
                local = squareGrid.findIndex(square => square.x == actualPathData[0] && square.y == actualPathData[1]);//console.log(local);
            }
            
            // Se o ponto anterior existe, e se a próxima posição é diferente do ponto anterior, então prossegue com a criação do caminho

            //console.log(actualPathData)

            if (previousPoint && (previousPoint[0] !== actualPathData[0] || previousPoint[1] !== actualPathData[1])) 
            {
                path(local);
            } 
            else 
            {
                path(local); // Se não há ponto anterior ou a próxima posição é igual ao ponto anterior, ainda assim cria o caminho
            }
            
            // Atualiza o ponto anterior para a posição atual
            previousPoint = [actualPathData[0], actualPathData[1]]; console.log(previousPoint);
        }

        determinePoints()

        genPathFlag = false
    }
}


function squareData(index)
{
    //console.log(`X: ${squareGrid[index].x} | Y: ${squareGrid[index].y}`)
    return [squareGrid[index].x, squareGrid[index].y,squareGrid[index].item]
}

//generateTable()
console.clear()

function checkRequirements(boxArray){
    if (boxArray.every(box=>box.correctPlace)){
        phase += 1
        boxArray.forEach(box=>box.doesMove = false)
    }
}

function btnClick(){
    phase += 1
    canvas.style.visibility = 'visible'
    document.querySelector('#menu').style.visibility = 'collapse'
}

//'Battery', 'Bulb','Resistor','Switch','Wire','Wire','Wire'
//battery, bulbOff, resistor, switchOn

function generateBoxComponents(){
    boxes.push(new Box(0 + 0 * 75, 400, 50, 50, null, battery, 'Battery', 225, 275))
    boxes.push(new Box(0 + 1 * 75, 400, 50, 50, null, bulbOff, 'Bulb', 225, 175))
    boxes.push(new Box(0 + 2 * 75, 400, 50, 50, null, resistor, 'Resistor', 175, 225))
    boxes.push(new Box(0 + 3 * 75, 400, 50, 50, null, switchOn, 'Switch', 275, 225))
}

function generateBoxWires(){
    boxes.push(new Box(0 + 0 * 75, 400, 50, 50, null, wireSL, 'Wire', 175, 175))
    boxes.push(new Box(0 + 1 * 75, 400, 50, 50, null, wireSR, 'Wire', 275, 175))
    boxes.push(new Box(0 + 2 * 75, 400, 50, 50, null, wireIL, 'Wire', 175, 275))
    boxes.push(new Box(0 + 3 * 75, 400, 50, 50, null, wireIR, 'Wire', 275, 275))
}

function determinePoints(){
    let biggestX = -999
    let biggestY = -999
    let lowestX = 999
    let lowestY = 999
    points.forEach(point => {
        if(point.X > biggestX){
            biggestX = point.X
        }
        if(point.Y > biggestY){
            biggestY = point.X
        }

        if(point.X < lowestX){
            lowestX = point.X
        }
        if(point.Y < lowestY){
            lowestY = point.X
        }
    })

    pointIL = {x: lowestX, y:lowestY}
    pointIR = {x: biggestX, y:lowestY}
    pointSL = {x: lowestX, y:biggestY}
    pointSR = {x: biggestX, y:biggestY}

    console.log(pointIL);
    console.log(pointIR);
    console.log(pointSL);
    console.log(pointSR);
}

function animateElectrons(){
    let velocity = 1
    points.forEach(point => {
        if (point.Y == pointIL.y && point.Y == pointIR.y && point.X != pointIR.x) {
            point.X += velocity
        }

        if (point.X == pointIL.x && point.X == pointSL.x && point.Y != pointIL.y) {
            point.Y -= velocity
        }

        if (point.Y == pointSL.y && point.Y == pointSR.y && point.X != pointSL.x) {
            point.X -= velocity
        }

        if (point.X == pointIR.x && point.X == pointSR.x && point.Y != pointSR.y) {
            point.Y += velocity
        }
    })
}