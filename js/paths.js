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