const onlineShaderSourceFolderURL: string = "https://heestand-xyz.github.io/texture.js/sources/shaders/"

class TEX {
    
    static shaderFolder?: string

    id: number

    shaderPath: string
    
    // texture?: WebGLTexture
    // framebuffer?: WebGLFramebuffer

    // program?: WebGLProgram

    texOutputs: TEX[] = []

    render?: TEXRender

    // editIndex: number = 0
    // get totalEditIndex(): number {
    //     if (this instanceof TEXContent) {
    //         return this.editIndex
    //     } else if (this instanceof TEXEffect) {
    //         let texEffect = this as TEXEffect
    //         var inputsEditIndex: number = 0
    //         for (let index = 0; index < texEffect.texInputs.length; index++) {
    //             const texInput = texEffect.texInputs[index];
    //             inputsEditIndex += texInput.editIndex
    //         }
    //         return inputsEditIndex
    //     }
    //     return 0
    // }
    // renderIndex: number = 0
    // get renderInSync(): boolean {
    //     return this.editIndex == this.renderIndex
    // }

    get firstResolution(): TEXResolution | null {
        if (this instanceof TEXContent) {
            let texContent = this as TEXContent
            if (texContent.resolution != null) {
                return texContent.resolution!
            }
        } else if (this instanceof TEXEffect) {
            let texEffect = this as TEXEffect
            if (texEffect.texInputs.length > 0) {
                return texEffect.texInputs[0].firstResolution
            }
        }
        return null
    }

    uniformBools: () => Record<string, boolean> = function _(): Record<string, boolean> { return {} }
    uniformInts: () => Record<string, number> = function _(): Record<string, number> { return {} }
    uniformFloats: () => Record<string, number> = function _(): Record<string, number> { return {} }
    uniformPositions: () => Record<string, TEXPosition> = function _(): Record<string, TEXPosition> { return {} }
    uniformResolutions: () => Record<string, TEXResolution> = function _(): Record<string, TEXResolution> { return {} }
    uniformColors: () => Record<string, TEXColor> = function _(): Record<string, TEXColor> { return {} }

    uniformArrayOfFloats: () => Record<string, number[]> = function _(): Record<string, number[]> { return {} }
    uniformArrayOfColors: () => Record<string, TEXColor[]> = function _(): Record<string, TEXColor[]> { return {} }

    subRender?: (gl: WebGLRenderingContext, program: WebGLProgram) => void

    constructor(shaderPath: string) {
        
        console.log(this.constructor.name + " - " + "Init")

        this.id = Math.random()

        this.shaderPath = shaderPath

    }

    // Setup

    setup(gl: WebGLRenderingContext, completion: (program: WebGLProgram) => void) {

        this.loadShader((fragmentShaderSource: string) : void => {

            let vertexShaderSource: string = "attribute vec4 position; void main() { gl_Position = position; }"
            let vertexShader: WebGLShader = this.createShader(gl, vertexShaderSource, gl.VERTEX_SHADER)
            let fragmentShader: WebGLShader = this.createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER)
    
            const program: WebGLProgram = this.createProgram(gl, vertexShader, fragmentShader)
    
            completion(program)

        })

    }
    
    // Load

    loadShader(loaded: (_: string) => (void)) {
        var path: string = "";
        if (TEX.shaderFolder != null) {
            path = TEX.shaderFolder! + this.shaderPath
        } else {
            path = onlineShaderSourceFolderURL + this.shaderPath
        }
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", path, false);
        rawFile.onreadystatechange = function () {
            if(rawFile.readyState === 4) {
                if(rawFile.status === 200 || rawFile.status == 0) {
                    loaded(rawFile.responseText)
                }
            }
        }
        rawFile.send(null);
    }

    // Update

    didConnect() {
        console.log(this.constructor.name + " - " + "Did Connect")
        console.log()
        const self = this
        this.reverseContentCrawl(function _(tex, done) {
            console.log(self.constructor.name + " - " + "Did Connect - Crawl:", tex.constructor.name)
            tex.downstreamRefresh(self)
            done()
        }, function completion() {})
    }

    didEdit() {
        console.log(this.constructor.name + " - " + "Did Edit")
        // this.editIndex += 1
        this.render?.draw()
        this.refresh()
    }

    downstreamRefresh(fromTex: TEX) {
        console.log(this.constructor.name + " - " + "Downstream Refresh from:", fromTex.constructor.name)
        this.refresh()
    }

    upstreamRefresh(fromTex: TEX) {
        console.log(this.constructor.name + " - " + "Upstream Refresh from:", fromTex.constructor.name)
        this.refresh()
    }

    refresh() {
        console.log(this.constructor.name + " - " + "Refresh")
        this.render?.draw()
        for (let index = 0; index < this.texOutputs.length; index++) {
            const texOutput = this.texOutputs[index];
            texOutput.upstreamRefresh(this)
        }
    }

    // Create

    createShader(gl: WebGLRenderingContext, sourceCode: string, type: number): WebGLShader {
        var shader: WebGLShader = gl.createShader(type)!;
        gl.shaderSource(shader, sourceCode);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            let info = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader)
            console.log("GL Shader Error:", info)
            throw 'GL Shader Error.\n\n' + info;
        }
        return shader;
    }

    createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
        
        const shaderProgram = gl.createProgram()!;
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            let info = gl.getProgramInfoLog(shaderProgram)
            console.log("GL Program Error:", info)
            throw 'GL Program Error.\n\n' + info;
        }
        
        return shaderProgram;
    }

    // Crawl

    reverseCrawl(callback: (tex: TEX, done: () => void) => void, completion: () => void) {
        if (this instanceof TEXContent) {
            callback(this, function _() {
                completion()
            })
        } else if (this instanceof TEXEffect) {
            let texEffect = this as TEXEffect
            var leftCount: number = texEffect.texInputs.length
            if (leftCount == 0) {
                callback(this, function _() {
                    completion()
                })
            }
            for (let index = 0; index < texEffect.texInputs.length; index++) {
                const inputTex = texEffect.texInputs[index];
                inputTex.reverseCrawl(callback, function _() {
                    leftCount -= 1
                    if (leftCount == 0) {
                        callback(texEffect, function _() {
                            completion()
                        })
                    }
                })
            }
        }
    }

    reverseContentCrawl(callback: (tex: TEX, done: () => void) => void, completion: () => void) {
        this.reverseCrawl(function _(tex, done) {
            if (tex instanceof TEXContent) {
                callback(tex, done)
            } else {
                done()
            }
        }, completion)
    }

    // activateTexture(texture: WebGLTexture, index: number) {

    //     if (index == 0) {
    //         this.gl.activeTexture(this.gl.TEXTURE0)
    //     } else if (index == 1) {
    //         this.gl.activeTexture(this.gl.TEXTURE1)
    //     }

    // }
    
    // // Push Pixels

    // // pixelPushIndex: number = 0
    // // 
    // // pushPixels(fromTex: TEX, toTex: TEX, index?: number) {
    // //     const currentPixelPushIndex = toTex.pixelPushIndex + 1
    // //     toTex.pixelPushIndex = currentPixelPushIndex
    // //     fromTex.canvas.toBlob(function(blob) {
    // //         if (currentPixelPushIndex != toTex.pixelPushIndex) { return; }
    // //         const image: TexImageSource = new Image(fromTex.resolution.width, fromTex.resolution.height)
    // //         image.src = URL.createObjectURL(blob)
    // //         image.onload = () => {
    // //             if (currentPixelPushIndex != toTex.pixelPushIndex) { return; }
    // //             var inputIndex: number = 0
    // //             if (index != null) {
    // //                 inputIndex = index!
    // //             } else {
    // //                 inputIndex = toTex.indexOfInput(fromTex)
    // //             }
    // //             toTex.createTexture(image, inputIndex!)
    // //             toTex.render()
    // //         }
    // //     });
    // // }

    // pushPixels(fromTex: TEX, _toTex: TEX, index?: number) {
    //     var inputIndex: number = 0
    //     if (index != null) {
    //         inputIndex = index!
    //     } else {
    //         inputIndex = this.indexOfInput(fromTex)
    //     }
    //     this.layout()
    //     this.render()
    // }

    // indexOfInput(tex: TEX): number {
    //     for (let index = 0; index < this.inputs.length; index++) {
    //         const input = this.inputs[index];
    //         if (tex == input) {
    //             return index
    //         }
    //     }
    //     return 0
    // }

}