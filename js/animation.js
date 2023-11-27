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