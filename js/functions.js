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