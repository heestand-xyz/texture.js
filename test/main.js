console.log("texture.js test")

TEX.shaderFolder = "../shaders/"

// var canvasOne = document.getElementById("canvasOne");
var canvasTwo = document.getElementById("canvasTwo");

function resize() {
    // canvasOne.width = canvasOne.clientWidth
    // canvasOne.height = canvasOne.clientHeight
    canvasTwo.width = canvasTwo.clientWidth
    canvasTwo.height = canvasTwo.clientHeight
}
resize()

// const circle = new CircleTEX(canvasOne, 0.5)
const polygon = new PolygonTEX(canvasTwo, 0.5)

// function draw() {
//     circle.draw()
//     polygon.draw()
// }
// window.addEventListener('resize', function() {
//     resize()
//     draw()
// })