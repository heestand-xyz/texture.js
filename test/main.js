console.log("texture.js test")

var canvasOne = document.getElementById("canvasOne");
var canvasTwo = document.getElementById("canvasTwo");

const circle = new CircleTEX(canvasOne, 0.5)
const saturation = new SaturationTEX(canvasTwo, circle, 0.5)
