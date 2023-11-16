class Battery{
    constructor(boxId, voltage) {
        this.boxId = boxId

        this.voltage = voltage

        this.componentName = 'Battery'
    }
}

class Resistor{
    constructor(boxId, resistanceOhm) {
        this.boxId = boxId

        this.resistanceOhm
        this.componentName = 'Resistor'
    }
}

class LightBulb{
    constructor(boxId, resistanceOhm) {
        this.boxId = boxId

        this.resistanceOhm
        this.isOn = true

        this.componentName = 'LightBulb'
    }

    toggle(){
        this.isOn = !this.isOn
    }
}

class Switch{
    constructor(boxId) {
        this.boxId = boxId

        this.isOn = true

        this.componentName = 'Switch'
    }

    toggle(){
        this.isOn = !this.isOn
    }
}