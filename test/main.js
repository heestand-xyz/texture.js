console.log("texture.js test")

TEX.shaderFolder = "../shaders/"


var canvasOne = document.getElementById("canvasOne");
var canvasTwo = document.getElementById("canvasTwo");
var canvasThree = document.getElementById("canvasThree");
var canvasFour = document.getElementById("canvasFour");


function resize() {
    canvasOne.width = canvasOne.clientWidth
    canvasOne.height = canvasOne.clientHeight
    canvasTwo.width = canvasTwo.clientWidth
    canvasTwo.height = canvasTwo.clientHeight
    canvasThree.width = canvasThree.clientWidth
    canvasThree.height = canvasThree.clientHeight
    canvasFour.width = canvasFour.clientWidth
    canvasFour.height = canvasFour.clientHeight
}
resize()

const circleTex = new CircleTEX(canvasOne)
circleTex.color = new Color(1.0, 0.5, 0.0, 1.0)

const polygonTex = new PolygonTEX(canvasTwo)
polygonTex.color = new Color(0.0, 0.5, 1.0, 1.0)
polygonTex.radius = 1.0 / 3.0

// const imageTex = new ImageTEX(canvasThree)
// let image = new Image();
// image.src = "http://heestand.xyz/assets/images/kite.jpg"
// image.onload = function() {
//     imageTex.loadImage(image)
// }

const blendTex = new BlendTEX(canvasThree, circleTex, polygonTex)
blendTex.inputA = circleTex
blendTex.inputB = polygonTex

const colorShiftTex = new ColorShiftTEX(canvasFour)
colorShiftTex.input = blendTex

// Mouse Over

canvasOne.addEventListener('mousemove', e => {
    // console.log("mouse move on one")
    const x = (e.offsetX - canvasOne.clientWidth / 2.0) / canvasOne.clientHeight;
    const y = e.offsetY / canvasOne.clientHeight - 0.5;
    const dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
    circleTex.radius = dist / 2 
})

canvasTwo.addEventListener('mousemove', e => {
    // console.log("mouse move on two")
    const x = e.offsetX / canvasTwo.clientWidth;
    const y = e.offsetY / canvasTwo.clientHeight;
    polygonTex.rotation = x
    polygonTex.cornerRadius = y * 0.075
})

canvasFour.addEventListener('mousemove', e => {
    // console.log("mouse move on four")
    const x = e.offsetX / canvasFour.clientWidth;
    const y = e.offsetY / canvasFour.clientHeight;
    colorShiftTex.hue = x
    colorShiftTex.saturation = 0.5 + y
})

// Click

canvasThree.addEventListener('click', e => {
    // console.log("click on three")
    circleTex.render()
})

// Window Resize

function update() {
    circleTex.layout()
    circleTex.render()
    polygonTex.layout()
    polygonTex.render()
    blendTex.layout()
    blendTex.render()
    colorShiftTex.layout()
    colorShiftTex.render()
}
window.addEventListener('resize', function() {
    resize()
    update()
})