function drawMenu()
{
    ctx.fillStyle = 'black'
    ctx.font = '30px Arial Black'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Construção de um Circuito', W/2, H/4)
    
    menuBtn.draw()
}

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

function generateText(text, x,y)
{
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

    let squareCheckItem = squareData(local); //console.log(squareCheckItem);

    
    oldPathData = actualPathData;
    oldLocal = local;

    if (squareCheckItem[2] == 'Battery') 
    {
        checkDir(local)
    } 
    else 
    {
        checkDir(local)
    }
    drawPoint(squareCheckItem[0], squareCheckItem[1])
}

function drawPoint(x,y)
{
    let pointX = x + pixelSizeX / 2; let pointY = y + pixelSizeY / 2;
    points.push(new Point(pointX, pointY)); console.table(points);
}

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

        //NOTA: Alterações de imagem #ASeparar
        console.log('ON');
        boxes[1].img = bulbOn
        boxes[3].img = switchOn
    }
}

function squareData(index)
{
    //console.log(`X: ${squareGrid[index].x} | Y: ${squareGrid[index].y}`)
    return [squareGrid[index].x, squareGrid[index].y,squareGrid[index].item]
}

function checkRequirements(boxArray)
{
    if (boxArray.every(box=>box.correctPlace)){
        phase += 1
        boxArray.forEach(box=>box.doesMove = false)
    }
}

function btnClick()
{
    phase += 1
    canvas.style.visibility = 'visible'
    document.querySelector('#menu').style.visibility = 'collapse'
    generateBoxComponents()
}


function generateBoxComponents()
{
    boxes.push(new Box(35 + 1 * 75, 400, 50, 50, null, battery, 'Battery', 225, 275))
    boxes.push(new Box(35 + 2 * 75, 400, 50, 50, null, bulbOff, 'Bulb', 225, 175))
    boxes.push(new Box(35 + 3 * 75, 400, 50, 50, null, resistor, 'Resistor', 175, 225))
    boxes.push(new Box(35 + 4 * 75, 400, 50, 50, null, switchOn, 'Switch', 275, 225))
}

function generateBoxWires()
{
    boxes.push(new Box(0 + 2.75 * 70, 380, 50, 50, null, wireSL, 'Wire', 175, 175))
    boxes.push(new Box(0 + 3.75 * 70, 380, 50, 50, null, wireSR, 'Wire', 275, 175))
    boxes.push(new Box(0 + 2.75 * 70, 450, 50, 50, null, wireIL, 'Wire', 175, 275))
    boxes.push(new Box(0 + 3.75 * 70, 450, 50, 50, null, wireIR, 'Wire', 275, 275))
}

function determinePoints()
{
    let biggestX = -999
    let biggestY = -999
    let lowestX = 999
    let lowestY = 999
    points.forEach(point => {
        if(point.X > biggestX){
            biggestX = point.X
        }
        if(point.Y > biggestY){
            biggestY = point.Y
        }

        if(point.X < lowestX){
            lowestX = point.X
        }
        if(point.Y < lowestY){
            lowestY = point.Y
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

function animateElectrons()
{
    let velocity = ampere*toggleSwitch*0.75
    points.forEach(point => {
        if (point.Y == pointIL.y && point.Y == pointIR.y && point.X != pointIR.x) {
            point.X += velocity
            if (point.X > pointIR.x) {
                point.X = pointIR.x
            }
        }

        if (point.X == pointIL.x && point.X == pointSL.x && point.Y != pointIL.y) {
            point.Y -= velocity
            if (point.Y < pointIL.y) {
                point.Y = pointIL.y
            }
        }

        if (point.Y == pointSL.y && point.Y == pointSR.y && point.X != pointSL.x) {
            point.X -= velocity
            if (point.X < pointSL.x) {
                point.X = pointSL.x
            }
        }

        if (point.X == pointIR.x && point.X == pointSR.x && point.Y != pointSR.y) {
            point.Y += velocity
            if (point.Y > pointSR.y) {
                point.Y = pointSR.y
            }
        }
    })
}

//NOTA: Funções de manipulação da velocidade #ASeparar
function changeAmpere()
{
    ampere = batteryVolt/(resistanceRes + bulbRes)*toggleSwitch
    document.querySelector('#currentCurrent').textContent = `Corrente: ${ampere} Ampere${ampere != 1 ? 's' : ''}`
}

function toggleCircuit()
{
    if (toggleSwitch == 1) {
        toggleSwitch = 0
        btnCircuitSwitch.textContent = 'DESLIGADO'
        boxes[1].img = bulbOff
        boxes[3].img = switchOff
    } else {
        toggleSwitch = 1
        btnCircuitSwitch.textContent = 'LIGADO'
        boxes[1].img = bulbOn
        boxes[3].img = switchOn
    }
    changeAmpere()
}

function batteryOnFire() {
    if (ampere > 15) {
        if (toggleSwitch == 1){
            boxes[1].img = bulbOff
            generateFire()
        }
        document.querySelector('#alert').style.visibility = 'visible'
    } else {
        document.querySelector('#alert').style.visibility = 'collapse'
    }
}

function generateFire(){
    let frame =  Math.floor(fireFrame/10)
    ctx.drawImage(fireSprite, frame*20, 0, 20, 24, 225,245, 50,50)
    if (fireFrame === 80){
        fireFrame = 0
    } else {
        fireFrame++
    }
}