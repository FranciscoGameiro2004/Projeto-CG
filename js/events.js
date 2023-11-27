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

canvas.addEventListener('click', e =>{
    menuBtn.click(e)
})