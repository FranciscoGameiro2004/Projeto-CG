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