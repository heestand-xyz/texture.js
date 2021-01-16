// class Resolution {
//     width: number
//     height: number
//     constructor(width: number, height: number) {
//         this.width = width
//         this.height = height
//     }
// }

class TEX {

    // resolution: Resolution

    canvas: HTMLCanvasElement
    gl: WebGL2RenderingContext
    
    vertexShader: WebGLShader
    fragmentShader: WebGLShader

    constructor(canvas: HTMLCanvasElement, shaderSource: string) {

        this.canvas = canvas
        this.gl = this.canvas.getContext("webgl2")!

        let vertexShaderSource: string =
        'attribute vec4 position;\n' +
        'void main() {\n' +
        '  gl_Position = position;\n' +
        '}\n';
        this.vertexShader = this.createShader(this.gl, vertexShaderSource, this.gl.VERTEX_SHADER)
        this.fragmentShader = this.createShader(this.gl, shaderSource, this.gl.FRAGMENT_SHADER)

    }

    createShader(gl: WebGL2RenderingContext, sourceCode: string, type: number): WebGLShader {
        var shader: WebGLShader = gl.createShader( type )!;
        gl.shaderSource( shader, sourceCode );
        gl.compileShader( shader );
        
        if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
            var info = gl.getShaderInfoLog( shader );
            throw 'Could not compile WebGL program. \n\n' + info;
        }
        return shader;
    }

}

class TEXIn extends TEX {
    
    inTex?: TEX

    constructor(canvas: HTMLCanvasElement, inTex: TEX, shaderSource: string) {
        super(canvas, shaderSource)
        this.inTex = inTex
    }

}

// Content

class CircleTEX extends TEX {

    radius: number

    constructor(canvas: HTMLCanvasElement, radius: number) {
        
        super(canvas, "")
        this.radius = radius

        // this.context.beginPath();
        // this.context.arc(100, 75, 50, 0, 2 * Math.PI);
        // this.context.stroke();

    }

}

// Effects

class SaturationTEX extends TEXIn {

    saturation: number

    constructor(canvas: HTMLCanvasElement, inTex: TEX, saturation: number) {
        super(canvas, inTex, "")
        this.saturation = saturation
    }

}
