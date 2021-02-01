
class RenderTarget {

    tex: TEX

    canvas: HTMLCanvasElement
    gl: WebGLRenderingContext
    
    shaderProgram!: WebGLProgram
    quadBuffer!: WebGLBuffer
    
    constructor(tex: TEX, canvas: HTMLCanvasElement) {

        this.tex = tex

        this.canvas = canvas
        
        this.gl = this.canvas.getContext("webgl")!

        this.load(tex.shaderPath, (source: string) : void => {
            this.setup(source)
            this.render()    
        })

    }

    // Load

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

    // Setup

    setup(fragmentShaderSource: string) {
        
        let vertexShaderSource: string = "attribute vec4 position; void main() { gl_Position = position; }"
        let vertexShader: WebGLShader = this.createShader(this.gl, vertexShaderSource, this.gl.VERTEX_SHADER)
        let fragmentShader: WebGLShader = this.createShader(this.gl, fragmentShaderSource, this.gl.FRAGMENT_SHADER)

        this.shaderProgram = this.createProgram(this.gl, vertexShader, fragmentShader)

        this.quadBuffer = this.createQuadBuffer(this.gl)

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

    createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        
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

    createQuadBuffer(gl: WebGLRenderingContext): WebGLBuffer {

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


    // Render

    public render() {
        // console.log(this.shaderPath + " - " + "render")
        // this.renderTo(this.framebuffer)
        this.renderTo(this.tex, null)
        // this.tex.outputs.forEach(output => {
        //     output.pushPixels(this, output)
        // });
    }
    
    renderTo(tex: TEX, framebuffer: WebGLFramebuffer | null) {

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

        if (tex.subRender != undefined) {
            tex.subRender!(this.gl, this.shaderProgram);
        }

        // Global Resolution
        let resolution: TEXResolution = tex.chainResolution ?? new TEXResolution(this.canvas.width, this.canvas.height)
        let resolutionLocation: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, "u_resolution")!
        this.gl.uniform2i(resolutionLocation, resolution.width, resolution.height)
        
        // Bools
        const uniformBools: Record<string, boolean> = tex.uniformBools();
        for (var key in uniformBools) {
            let value: Boolean = uniformBools[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform1i(location, value ? 1 : 0);
        }

        // Ints
        const uniformInts: Record<string, number> = tex.uniformInts();
        for (var key in uniformInts) {
            let value: number = uniformInts[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform1i(location, value);
        }

        // Floats
        const uniformFloats: Record<string, number> = tex.uniformFloats();
        for (var key in uniformFloats) {
            let value: number = uniformFloats[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform1f(location, value);
        }

        // Positions
        const uniformPositions: Record<string, TEXPosition> = tex.uniformPositions();
        for (var key in uniformPositions) {
            let value: TEXPosition = uniformPositions[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform2f(location, value.x, value.y);
        }

        // Resolutions
        const uniformResolutions: Record<string, TEXResolution> = tex.uniformResolutions();
        for (var key in uniformResolutions) {
            let value: TEXResolution = uniformResolutions[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform2i(location, value.width, value.height);
        }

        // Colors
        const uniformColors: Record<string, TEXColor> = tex.uniformColors();
        for (var key in uniformColors) {
            let value: TEXColor = uniformColors[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform4f(location, value.red, value.green, value.blue, value.alpha);
        }

        // Array of Floats
        const uniformArrayOfFloats: Record<string, number[]> = tex.uniformArrayOfFloats();
        for (var key in uniformArrayOfFloats) {
            let array: number[] = uniformArrayOfFloats[key];
            let list: Float32List = new Float32Array(array);
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform1fv(location, list);
        }

        // Array of Colors
        const uniformArrayOfColors: Record<string, TEXColor[]> = tex.uniformArrayOfColors();
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

    // Clear

    clear(gl: WebGLRenderingContext) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

}