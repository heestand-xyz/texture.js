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
polygonTex.cornerRadius = 0.05
polygonTex.rotation = 0.5

// const imageTex = new ImageTEX(canvasThree)
// let image = new Image();
// image.src = "http://heestand.xyz/assets/images/kite.jpg"
// image.onload = function() {
//     imageTex.loadImage(image)
// }

const blendTex = new BlendTEX(canvasThree, circleTex, polygonTex)


const colorShiftTex = new ColorShiftTEX(canvasFour)
colorShiftTex.input = circleTex


// canvasOne.addEventListener('mousemove', e => {
//     circleTex.radius = Math.abs(e.offsetY / canvasOne.clientHeight - 0.5)
//     circleTex.position.x = (e.offsetX - canvasOne.clientWidth / 2.0) / canvasOne.clientHeight
// })

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