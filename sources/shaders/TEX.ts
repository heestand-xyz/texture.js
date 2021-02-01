const onlineShaderSourceFolderURL: string = "https://heestand-xyz.github.io/texture.js/sources/shaders/"

class TEX {
    
    static shaderFolder?: string

    shaderPath: string
    
    canvas: HTMLCanvasElement
    gl: WebGLRenderingContext
    
    resolution!: TEXResolution
    texture!: WebGLTexture
    framebuffer!: WebGLFramebuffer

    shaderProgram!: WebGLProgram
    quadBuffer!: WebGLBuffer
    
    inputs: TEX[] = []
    outputs: TEX[] = []

    uniformBools: () => Record<string, boolean> = function _(): Record<string, boolean> { return {} }
    uniformInts: () => Record<string, number> = function _(): Record<string, number> { return {} }
    uniformFloats: () => Record<string, number> = function _(): Record<string, number> { return {} }
    uniformPositions: () => Record<string, TEXPosition> = function _(): Record<string, TEXPosition> { return {} }
    uniformResolutions: () => Record<string, TEXResolution> = function _(): Record<string, TEXResolution> { return {} }
    uniformColors: () => Record<string, TEXColor> = function _(): Record<string, TEXColor> { return {} }

    uniformArrayOfFloats: () => Record<string, number[]> = function _(): Record<string, number[]> { return {} }
    uniformArrayOfColors: () => Record<string, TEXColor[]> = function _(): Record<string, TEXColor[]> { return {} }

    subRender?: () => void

    constructor(shaderPath: string, canvas: HTMLCanvasElement) {

        this.shaderPath = shaderPath

        this.canvas = canvas
        
        this.gl = this.canvas.getContext("webgl")!

        this.layout()
        this.load(shaderPath, (source: string) : void => {
            this.setup(source)
            this.render()    
        })

    }

    // Setup

    load(shaderPath: string, loaded: (_: string) => (void)) {
        var path: string = "";
        if (TEX.shaderFolder != null) {
            path = TEX.shaderFolder! + shaderPath
        } else {
            path = onlineShaderSourceFolderURL + shaderPath
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

    setup(fragmentShaderSource: string) {
        
        let vertexShaderSource: string = "attribute vec4 position; void main() { gl_Position = position; }"
        let vertexShader: WebGLShader = this.createShader(this.gl, vertexShaderSource, this.gl.VERTEX_SHADER)
        let fragmentShader: WebGLShader = this.createShader(this.gl, fragmentShaderSource, this.gl.FRAGMENT_SHADER)

        this.shaderProgram = this.createProgram(this.gl, vertexShader, fragmentShader)

        this.quadBuffer = this.createQuadBuffer(this.gl)

    }

    // Create

    createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        
        const shaderProgram = gl.createProgram()!;
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
      
        // If creating the shader program failed, alert
      
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            let info = gl.getProgramInfoLog(shaderProgram)
            console.log("GL Program Error:", info)
            throw 'GL Program Error.\n\n' + info;
        }
      
        return shaderProgram;
    }

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
    
    createQuadBuffer(gl: WebGLRenderingContext) {

        // Create a buffer for the square's positions.
      
        const positionBuffer = gl.createBuffer()!;
      
        // Select the positionBuffer as the one to apply buffer
        // operations to from here out.
      
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      
        // Now create an array of positions for the square.
      
        const positions = [
            -1.0, 1.0,
            1.0, 1.0,
            -1.0, -1.0,
            1.0, -1.0,
        ];
      
        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.
      
        gl.bufferData(gl.ARRAY_BUFFER,
                      new Float32Array(positions),
                      gl.STATIC_DRAW);
      
        return positionBuffer
    }

    createEmptyTexture(gl: WebGLRenderingContext, resolution: TEXResolution): WebGLTexture {
        const emptyTexture = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, emptyTexture);
        {
            const internalFormat = gl.RGBA;
            const border = 0;
            const level = 0;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;
            const data = null;
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, resolution.width, resolution.height, border, format, type, data);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        return emptyTexture
    }

    createFramebuffer(gl: WebGLRenderingContext, texture: WebGLTexture, index: number = 0): WebGLFramebuffer {

        const framebuffer: WebGLFramebuffer = gl.createFramebuffer()!;
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

        const attachmentPoint = gl.COLOR_ATTACHMENT0;
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture, 0);
        
        return framebuffer

    }

    activateTexture(texture: WebGLTexture, index: number) {

        if (index == 0) {
            this.gl.activeTexture(this.gl.TEXTURE0)
        } else if (index == 1) {
            this.gl.activeTexture(this.gl.TEXTURE1)
        }

    }
    
    createTexture(image: TexImageSource, index: number = 0): WebGLTexture {

        const texture = this.gl.createTexture()!;

        this.activateTexture(texture, index)

        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

        const level = 0;
        const format = this.gl.RGBA;
        const type = this.gl.UNSIGNED_BYTE;
        this.gl.texImage2D(this.gl.TEXTURE_2D, level, format, format, type, image);

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

        return texture

    }

    clear(gl: WebGLRenderingContext) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    
    // Push Pixels

    // pixelPushIndex: number = 0
    // 
    // pushPixels(fromTex: TEX, toTex: TEX, index?: number) {
    //     const currentPixelPushIndex = toTex.pixelPushIndex + 1
    //     toTex.pixelPushIndex = currentPixelPushIndex
    //     fromTex.canvas.toBlob(function(blob) {
    //         if (currentPixelPushIndex != toTex.pixelPushIndex) { return; }
    //         const image: TexImageSource = new Image(fromTex.resolution.width, fromTex.resolution.height)
    //         image.src = URL.createObjectURL(blob)
    //         image.onload = () => {
    //             if (currentPixelPushIndex != toTex.pixelPushIndex) { return; }
    //             var inputIndex: number = 0
    //             if (index != null) {
    //                 inputIndex = index!
    //             } else {
    //                 inputIndex = toTex.indexOfInput(fromTex)
    //             }
    //             toTex.createTexture(image, inputIndex!)
    //             toTex.render()
    //         }
    //     });
    // }

    pushPixels(fromTex: TEX, _toTex: TEX, index?: number) {
        var inputIndex: number = 0
        if (index != null) {
            inputIndex = index!
        } else {
            inputIndex = this.indexOfInput(fromTex)
        }
        this.layout()
        this.render()
    }

    indexOfInput(tex: TEX): number {
        for (let index = 0; index < this.inputs.length; index++) {
            const input = this.inputs[index];
            if (tex == input) {
                return index
            }
        }
        return 0
    }

    // Layout

    public layout() {
        this.resolution = new TEXResolution(this.canvas.width, this.canvas.height)
        if (this.texture != null) {
            this.gl.deleteTexture(this.texture)
        }
        this.texture = this.createEmptyTexture(this.gl, this.resolution)
        if (this.framebuffer != null) {
            this.gl.deleteFramebuffer(this.framebuffer)
        }
        this.framebuffer = this.createFramebuffer(this.gl, this.texture)
    }

    // Render

    public render() {
        // console.log(this.shaderPath + " - " + "render")
        // this.renderTo(this.framebuffer)
        this.renderTo(null)
        this.outputs.forEach(output => {
            output.pushPixels(this, output)
        });
    }
    
    renderTo(framebuffer: WebGLFramebuffer | null) {

        this.clear(this.gl)

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);

        // Prep
        
        {
            const numComponents = 2;  // pull out 2 values per iteration
            const type = this.gl.FLOAT;    // the data in the buffer is 32bit floats
            const normalize = false;  // don't normalize
            const stride = 0;         // how many bytes to get from one set of values to the next
                                    // 0 = use type and numComponents above
            const attribPosition = this.gl.getAttribLocation(this.shaderProgram, 'position');
            const offset = 0;         // how many bytes inside the buffer to start from
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
            this.gl.vertexAttribPointer(
                attribPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            this.gl.enableVertexAttribArray(attribPosition);
        }

        this.gl.useProgram(this.shaderProgram);

        if (this.subRender != undefined) {
            this.subRender!();
        }

        // Global Resolution
        let resolutionLocation: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, "u_resolution")!
        this.gl.uniform2i(resolutionLocation, this.resolution.width, this.resolution.height)
        
        // Bools
        const uniformBools: Record<string, boolean> = this.uniformBools();
        for (var key in uniformBools) {
            let value: Boolean = uniformBools[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform1i(location, value ? 1 : 0);
        }

        // Ints
        const uniformInts: Record<string, number> = this.uniformInts();
        for (var key in uniformInts) {
            let value: number = uniformInts[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform1i(location, value);
        }

        // Floats
        const uniformFloats: Record<string, number> = this.uniformFloats();
        for (var key in uniformFloats) {
            let value: number = uniformFloats[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform1f(location, value);
        }

        // Positions
        const uniformPositions: Record<string, TEXPosition> = this.uniformPositions();
        for (var key in uniformPositions) {
            let value: TEXPosition = uniformPositions[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform2f(location, value.x, value.y);
        }

        // Resolutions
        const uniformResolutions: Record<string, TEXResolution> = this.uniformResolutions();
        for (var key in uniformResolutions) {
            let value: TEXResolution = uniformResolutions[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform2i(location, value.width, value.height);
        }

        // Colors
        const uniformColors: Record<string, TEXColor> = this.uniformColors();
        for (var key in uniformColors) {
            let value: TEXColor = uniformColors[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform4f(location, value.red, value.green, value.blue, value.alpha);
        }

        // Array of Floats
        const uniformArrayOfFloats: Record<string, number[]> = this.uniformArrayOfFloats();
        for (var key in uniformArrayOfFloats) {
            let array: number[] = uniformArrayOfFloats[key];
            let list: Float32List = new Float32Array(array);
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform1fv(location, list);
        }

        // Array of Colors
        const uniformArrayOfColors: Record<string, TEXColor[]> = this.uniformArrayOfColors();
        for (var key in uniformArrayOfColors) {
            let array: TEXColor[] = uniformArrayOfColors[key];
            var flatArray: number[] = [];
            for (let index = 0; index < array.length; index++) {
                const color: TEXColor = array[index];
                flatArray.push(color.red);
                flatArray.push(color.green);
                flatArray.push(color.blue);
                flatArray.push(color.alpha);
            }            
            let list: Float32List = new Float32Array(flatArray);
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform4fv(location, list)
        }

        // Final

        {
            const offset = 0;
            const vertexCount = 4;
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount);
        }

    }

}