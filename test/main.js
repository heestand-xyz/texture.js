console.log("texture.js test")

TEX.shaderFolder = "../sources/shaders/"

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


const gradientTex = new GradientTEX()
gradientTex.colorStops = [
    new GradientColorStop(0.0, TEXColor.black),
    new GradientColorStop(1.0, new TEXColor(0.0, 0.5, 1.0))
]
const renderTargetOne = new RenderTarget(gradientTex, canvasOne)

const polygonTex = new PolygonTEX(canvasTwo)
polygonTex.color = new TEXColor(1.0, 0.5, 0.0)

const blendTex = new BlendTEX(canvasThree)
blendTex.inputA = gradientTex
blendTex.inputB = polygonTex

const colorShiftTex = new ColorShiftTEX(canvasFour)
colorShiftTex.input = blendTex
colorShiftTex.saturation = 2.0

// const imageTex = new ImageTEX(canvasThree)
// imageTex.loadImageURL("http://heestand.xyz/assets/images/kite.jpg")

// Mouse Over

// canvasOne.addEventListener('mousemove', e => {
//     const x = e.offsetX / canvasTwo.clientWidth;
//     const y = e.offsetY / canvasTwo.clientHeight;
//     noiseTex.zPosition = x
// })

// canvasTwo.addEventListener('mousemove', e => {
//     const x = e.offsetX / canvasTwo.clientWidth;
//     const y = e.offsetY / canvasTwo.clientHeight;
//     polygonTex.rotation = (x - 0.5) * 0.25
//     polygonTex.cornerRadius = y * 0.1
// })

// canvasFour.addEventListener('mousemove', e => {
//     const x = e.offsetX / canvasFour.clientWidth;
//     const y = e.offsetY / canvasFour.clientHeight;
//     colorShiftTex.hue = x
//     colorShiftTex.saturation = 0.5 + y
// })

// Click

// canvasThree.addEventListener('click', e => {
//     // console.log("click on three")
//     gradientTex.render()
// })

// Window Resize

function update() {
    // circleTex.layout()
    // circleTex.render()
    // polygonTex.layout()
    // polygonTex.render()
    // blendTex.layout()
    // blendTex.render()
    // colorShiftTex.layout()
    // colorShiftTex.render()
}
window.addEventListener('resize', function() {
    resize()
    update()
})