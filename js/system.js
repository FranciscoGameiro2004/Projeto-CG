console.clear()
setInterval(() => 
{
    ctx.clearRect(0, 0, W, H);
    if (phase != 0){
        if (phase == 1)
        {
            tutorialText = 'Coloque os componentes nas suas áreas'
            checkRequirements(boxes)
        } 
        else if (phase == 2)
        {
            tutorialText = 'Conecte os componentes'
            if (addWires){
                //alert('ok')
                generateBoxWires()
                addWires = false
            }
            checkRequirements(boxes)
        } 
        else if (phase == 3)
        {
            tutorialText = ''
            generatePath()
        }
        generateText(tutorialText, W/2, 75)
        squareGrid.forEach(square => 
        {   
            square.draw();
        });
        boxes.forEach(box => 
        {
            box.draw()
        });
        points.forEach(point => 
        {
            point.draw()
        });
        if (phase < 3) {
            componentProperties.style.visibility = 'collapse'
        } else {
            componentProperties.style.visibility = 'visible'
        }

        try 
        {
            animateElectrons()
        } 
        catch (error) 
        {
            throw error
        }

        if (bulbRes == 0 || ampere == 0 || toggleSwitch == 0)
        {
            boxes[1].img = bulbOff
        } else {
            
        }
        batteryOnFire()
    } else {
        drawCircuitLines();
    }
}, 1);

function teste()
{
    console.log("Testing")
}