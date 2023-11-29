const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

//NOTA: Variáveis que acrescentei para controlo de componentes para separar depois #ASeparar
var btnCircuitSwitch = document.querySelector('#switch')
var rngBulb = document.querySelector('#bulb')
var rngBattery = document.querySelector('#battery')
var rngResistance = document.querySelector('#resistance')

var toggleSwitch = 1
var bulbRes = 10
var batteryVolt = 9
var resistanceRes = 10
var ampere = batteryVolt/(resistanceRes + bulbRes)

var lblBulb = document.querySelector('#lblBulb')
var lblBattery = document.querySelector('#lblBattery')
var lblResistance = document.querySelector('#lblResistance')

var pointIL = {x:0, y:0}
var pointIR = {x:0, y:0}
var pointSL = {x:0, y:0}
var pointSR = {x:0, y:0}

const componentProperties = document.querySelector('#componentProperties')

var genPathFlag = true
var addWires = true
var phase = 0
var tutorialText = ''
var padding = 125

const gridSize = 5;
const pixelSizeX = 250 / gridSize;
const pixelSizeY = 250 / gridSize;
var xInit = 0; var xEnd = 0;
var yInit = 0; var yEnd = 0;

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
var image = null

var posNum = [-5,-1,5,1]
var aceptablesItems = ['Bulb','Resistor','Switch','Wire']

var fireFrame = 0