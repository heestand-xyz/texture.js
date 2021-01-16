var fs = require('fs')
// import fs from 'fs'

class TEX {

    name: string

    canvas: HTMLCanvasElement
    gl: WebGL2RenderingContext
    
    vertexShader: WebGLShader
    fragmentShader: WebGLShader
    shaderProgram: WebGLProgram

    constructor(name: string, canvas: HTMLCanvasElement) {

        this.name = name

        this.canvas = canvas
        this.gl = this.canvas.getContext("webgl2")!

        let vertexShaderSource: string = "attribute vec4 position; void main() { gl_Position = position; }"
        let fragmentShaderSource: string = this.readShader(name)
        this.vertexShader = this.createShader(this.gl, vertexShaderSource, this.gl.VERTEX_SHADER)
        this.fragmentShader = this.createShader(this.gl, fragmentShaderSource, this.gl.FRAGMENT_SHADER)

        this.shaderProgram = this.createProgram(this.gl, this.vertexShader, this.fragmentShader)

        let quadBuffer: WebGLBuffer = this.createQuadBuffer(this.gl)

        this.clear(this.gl)
        this.draw(this.gl, this.shaderProgram, quadBuffer)

    }

    readShader(name: string): string {
        let path: string = "shaders/" + name + ".frag"
        return fs.readFileSync(path, "utf8")
    }

    createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        
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

    createShader(gl: WebGL2RenderingContext, sourceCode: string, type: number): WebGLShader {
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
    
    createQuadBuffer(gl: WebGL2RenderingContext) {

        // Create a buffer for the square's positions.
      
        const positionBuffer = gl.createBuffer()!;
      
        // Select the positionBuffer as the one to apply buffer
        // operations to from here out.
      
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      
        // Now create an array of positions for the square.
      
        const positions = [
          -1.0,  1.0,
           1.0,  1.0,
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

    clear(gl: WebGL2RenderingContext) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
        // Clear the canvas before we start drawing on it.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    draw(gl: WebGL2RenderingContext, program: WebGLProgram, quadBuffer: WebGLBuffer) {
        
        {
            const numComponents = 2;  // pull out 2 values per iteration
            const type = gl.FLOAT;    // the data in the buffer is 32bit floats
            const normalize = false;  // don't normalize
            const stride = 0;         // how many bytes to get from one set of values to the next
                                    // 0 = use type and numComponents above
            const attribPosition = this.gl.getAttribLocation(this.shaderProgram, 'position');
            const offset = 0;         // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
            gl.vertexAttribPointer(
                attribPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(attribPosition);
        }
            



        // Tell WebGL to use our program when drawing
      
        gl.useProgram(program);
      
        {
            const offset = 0;
            const vertexCount = 4;
            gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        }
    }
      

}

class TEXIn extends TEX {
    
    inTex?: TEX

    constructor(name: string, canvas: HTMLCanvasElement, inTex: TEX) {
        
        super(name, canvas)
        this.inTex = inTex

    }

}

// Content

class CircleTEX extends TEX {

    radius: number

    constructor(canvas: HTMLCanvasElement, radius: number) {
        
        super("CircleTEX", canvas)
        this.radius = radius

    }

}

// Effects

class SaturationTEX extends TEXIn {

    saturation: number

    constructor(canvas: HTMLCanvasElement, inTex: TEX, saturation: number) {

        super("SaturationTEX", canvas, inTex)
        this.saturation = saturation

    }

}
