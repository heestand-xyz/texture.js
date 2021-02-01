const onlineShaderSourceFolderURL: string = "https://heestand-xyz.github.io/texture.js/sources/shaders/"

class TEX {
    
    static shaderFolder?: string

    shaderPath: string
    
    texture!: WebGLTexture
    framebuffer!: WebGLFramebuffer

    inputs: TEX[] = []
    outputs: TEX[] = []

    public get chainResolution(): TEXResolution | null {
        if (this instanceof TEXContent) {
            let contentTex = this as TEXContent
            if (contentTex.resolution != null) {
                return contentTex.resolution!
            }
        } else if (this instanceof TEXEffect) {
            let effectTex = this as TEXEffect
            if (effectTex.inputs.length > 0) {
                return effectTex.inputs[0].chainResolution
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

    render?: TEXRender

    constructor(shaderPath: string) {
        
        console.log(this.constructor.name + " - " + "Created")

        this.shaderPath = shaderPath

    }

    refreshInputs() {
        console.log(this.constructor.name + " - " + "Refresh Inputs")
        console.log()
        this.refresh()
    }

    refresh() {
        console.log(this.constructor.name + " - " + "Refresh")
        this.render?.draw()
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

    // createEmptyTexture(gl: WebGLRenderingContext, resolution: TEXResolution): WebGLTexture {
    //     const emptyTexture = gl.createTexture()!;
    //     gl.bindTexture(gl.TEXTURE_2D, emptyTexture);
    //     {
    //         const internalFormat = gl.RGBA;
    //         const border = 0;
    //         const level = 0;
    //         const format = gl.RGBA;
    //         const type = gl.UNSIGNED_BYTE;
    //         const data = null;
    //         gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, resolution.width, resolution.height, border, format, type, data);
    //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //     }
    //     return emptyTexture
    // }

    // createFramebuffer(gl: WebGLRenderingContext, texture: WebGLTexture, index: number = 0): WebGLFramebuffer {

    //     const framebuffer: WebGLFramebuffer = gl.createFramebuffer()!;
    //     gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

    //     const attachmentPoint = gl.COLOR_ATTACHMENT0;
    //     gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture, 0);
        
    //     return framebuffer

    // }

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

    // Layout

    // public layout() {
    //     this.resolution = new TEXResolution(this.canvas.width, this.canvas.height)
    //     if (this.texture != null) {
    //         this.gl.deleteTexture(this.texture)
    //     }
    //     this.texture = this.createEmptyTexture(this.gl, this.resolution)
    //     if (this.framebuffer != null) {
    //         this.gl.deleteFramebuffer(this.framebuffer)
    //     }
    //     this.framebuffer = this.createFramebuffer(this.gl, this.texture)
    // }

}