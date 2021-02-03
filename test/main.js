console.log("texture.js test")

TEX.shaderFolder = "../sources/shaders/"

var canvasOne = document.getElementById("canvasOne");
var canvasTwo = document.getElementById("canvasTwo");
var canvasThree = document.getElementById("canvasThree");
var canvasFour = document.getElementById("canvasFour");
var canvasFive = document.getElementById("canvasFive");
var canvasSix = document.getElementById("canvasSix");

function resize() {
    canvasOne.width = canvasOne.clientWidth
    canvasOne.height = canvasOne.clientHeight
    canvasTwo.width = canvasTwo.clientWidth
    canvasTwo.height = canvasTwo.clientHeight
    canvasThree.width = canvasThree.clientWidth
    canvasThree.height = canvasThree.clientHeight
    canvasFour.width = canvasFour.clientWidth
    canvasFour.height = canvasFour.clientHeight
    canvasFive.width = canvasFive.clientWidth
    canvasFive.height = canvasFive.clientHeight
    canvasSix.width = canvasSix.clientWidth
    canvasSix.height = canvasSix.clientHeight
}
resize()


const gradientTex = new GradientTEX()
gradientTex.colorStops = [
    new GradientColorStop(0.0, TEXColor.black),
    new GradientColorStop(1.0, new TEXColor(0.0, 0.5, 1.0))
]
new TEXRender(gradientTex, canvasOne)

const polygonTex = new PolygonTEX()
polygonTex.color = new TEXColor(0.0, 0.5, 1.0)
new TEXRender(polygonTex, canvasTwo)

const blendTex = new BlendTEX()
blendTex.inputA = gradientTex
blendTex.inputB = polygonTex
new TEXRender(blendTex, canvasThree)

const colorShiftTex1 = new ColorShiftTEX()
colorShiftTex1.input = blendTex
colorShiftTex1.hue = 0.5
new TEXRender(colorShiftTex1, canvasFour)

const colorShiftTex2 = new ColorShiftTEX()
colorShiftTex2.input = colorShiftTex1
colorShiftTex2.saturation = 2.0
new TEXRender(colorShiftTex2, canvasFive)

const colorShiftTex3 = new ColorShiftTEX()
colorShiftTex3.input = colorShiftTex2
colorShiftTex3.saturation = 0.0
new TEXRender(colorShiftTex3, canvasSix)

// const imageTex = new ImageTEX(canvasThree)
// imageTex.loadImageURL("http://heestand.xyz/assets/images/kite.jpg")

// Mouse Over

// canvasOne.addEventListener('mousemove', e => {
//     const x = e.offsetX / canvasTwo.clientWidth;
//     const y = e.offsetY / canvasTwo.clientHeight;
//     noiseTex.zPosition = x
// })

canvasTwo.addEventListener('mousemove', e => {
    const u = e.offsetX / canvasTwo.clientWidth;
    const v = e.offsetY / canvasTwo.clientHeight;
    const aspect = canvasTwo.clientWidth / canvasTwo.clientHeight
    const x = (u - 0.5) * aspect;
    const y = (1.0 - v) - 0.5;
    polygonTex.rotation = -Math.atan2(y, x) / (Math.PI * 2)
    polygonTex.position = new TEXPosition(x, y)
})

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