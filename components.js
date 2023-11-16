class Battery{
    constructor(boxId, voltage) {
        this.boxId = boxId

        this.voltage = voltage
    }
}

class Resistor{
    constructor(boxId, resistanceOhm) {
        this.boxId = boxId

        this.resistanceOhm
    }
}

class LightBulb{
    constructor(boxId, resistanceOhm) {
        this.boxId = boxId

        this.resistanceOhm
        this.isOn = true
    }

    toggle(){
        this.isOn = !this.isOn
    }
}

class Switch{
    constructor(boxId) {
        this.boxId = boxId

        this.isOn = true
    }

    toggle(){
        this.isOn = !this.isOn
    }
}