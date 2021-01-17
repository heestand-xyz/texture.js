class Color {
    red: number
    green: number
    blue: number
    alpha: number
    constructor(red: number, green: number, blue: number, alpha: number) {
        this.red = red
        this.green = green
        this.blue = blue
        this.alpha = alpha
    }
}

class Position {
    x: number
    y: number
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}

// TEX

class TEX {
    
    static shaderFolder =  "shaders/"

    name: string

    canvas: HTMLCanvasElement
    gl: WebGLRenderingContext
    
    shaderProgram!: WebGLProgram
    quadBuffer!: WebGLBuffer

    uniformBools: () => Record<string, boolean> = function _(): Record<string, boolean> { return {} }
    uniformInts: () => Record<string, number> = function _(): Record<string, number> { return {} }
    uniformFloats: () => Record<string, number> = function _(): Record<string, number> { return {} }
    uniformPositions: () => Record<string, Position> = function _(): Record<string, Position> { return {} }
    uniformColors: () => Record<string, Color> = function _(): Record<string, Color> { return {} }

    constructor(name: string, canvas: HTMLCanvasElement) {

        this.name = name

        this.canvas = canvas
        this.gl = this.canvas.getContext("webgl")!

        this.loadShader(name, (source: string) : void => {
            this.setup(source)
        })

    }

    loadShader(name: string, loaded: (_: string) => (void)) {
        let path: string = TEX.shaderFolder + name + ".frag"
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

        this.draw()

    }

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

    clear(gl: WebGLRenderingContext) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
        // Clear the canvas before we start drawing on it.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    draw() {
      
        this.clear(this.gl)

        console.log("texture.js draw " + this.name)
        
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



        let resolutionLocation: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, "u_resolution")!
        this.gl.uniform2i(resolutionLocation, this.canvas.width, this.canvas.height)
        
        // Bools
        const uniformBools: Record<string, boolean> = this.uniformBools();
        for (var key in uniformBools) {
            let value = uniformBools[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform1i(location, value ? 1 : 0);
        }

        // Ints
        const uniformInts: Record<string, number> = this.uniformInts();
        for (var key in uniformInts) {
            let value = uniformInts[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform1i(location, value);
        }

        // Floats
        const uniformFloats: Record<string, number> = this.uniformFloats();
        for (var key in uniformFloats) {
            let value = uniformFloats[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform1f(location, value);
        }

        // Positions
        const uniformPositions: Record<string, Position> = this.uniformPositions();
        for (var key in uniformPositions) {
            let value = uniformPositions[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform2f(location, value.x, value.y);
        }

        // Colors
        const uniformColors: Record<string, Color> = this.uniformColors();
        for (var key in uniformColors) {
            let value = uniformColors[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform4f(location, value.red, value.green, value.blue, value.alpha);
        }

        {
            const offset = 0;
            const vertexCount = 4;
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount);
        }

    }

}

// Content

class TEXContent extends TEX {

    _backgroundColor: Color = new Color(0.0, 0.0, 0.0, 1.0)
    public get backgroundColor(): Color { return this._backgroundColor }
    public set backgroundColor(value: Color) { this._backgroundColor = value; this.draw(); }
    
    _foregroundColor: Color = new Color(1.0, 1.0, 1.0, 1.0)
    public get foregroundColor(): Color { return this._foregroundColor }
    public set foregroundColor(value: Color) { this._foregroundColor = value; this.draw(); }

    _position: Position = new Position(0.0, 0.0)
    public get position(): Position { return this._position }
    public set position(value: Position) { this._position = value; this.draw(); }

    constructor(name: string, canvas: HTMLCanvasElement) {
        
        super(name, canvas)

        this.uniformPositions = function _(): Record<string, Position> {
            let uniforms: Record<string, Position> = {};
            uniforms["u_position"] = this.position;
            return uniforms
        }
        this.uniformColors = function _(): Record<string, Color> {
            let uniforms: Record<string, Color> = {};
            uniforms["u_backgroundColor"] = this.backgroundColor;
            uniforms["u_foregroundColor"] = this.foregroundColor;
            return uniforms
        }
        super.draw()

    }

}

class CircleTEX extends TEXContent {

    _radius: number = 0.25
    public get radius(): number { return this._radius }
    public set radius(value: number) { this._radius = value; this.draw(); }

    constructor(canvas: HTMLCanvasElement) {
        
        super("CircleTEX", canvas)

        this.uniformFloats = function _(): Record<string, number> {
            let uniforms: Record<string, number> = {};
            uniforms["u_radius"] = this.radius;
            return uniforms
        }
        super.draw()

    }

    // uniforms(): [string: float] {
        
    //     let resolutionLocation: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, "u_resolution")!
    //     this.gl.uniform2i(resolutionLocation, this.canvas.width, this.canvas.height)
        
    // }

}

class PolygonTEX extends TEXContent {

    _radius: number = 0.25
    public get radius(): number { return this._radius }
    public set radius(value: number) { this._radius = value; this.draw(); }

    _rotation: number = 0.0
    public get rotation(): number { return this._rotation }
    public set rotation(value: number) { this._rotation = value; this.draw(); }

    _vertexCount: number = 3
    public get vertexCount(): number { return this._vertexCount }
    public set vertexCount(value: number) { this._vertexCount = value; this.draw(); }

    _cornerRadius: number = 0.0
    public get cornerRadius(): number { return this._cornerRadius }
    public set cornerRadius(value: number) { this._cornerRadius = value; this.draw(); }

    constructor(canvas: HTMLCanvasElement) {
        
        super("PolygonTEX", canvas)

        this.uniformFloats = function _(): Record<string, number> {
            let uniforms: Record<string, number> = {};
            uniforms["u_radius"] = this.radius;
            uniforms["u_rotation"] = this.rotation;
            uniforms["u_cornerRadius"] = this.cornerRadius;
            return uniforms
        }
        this.uniformInts = function _(): Record<string, number> {
            let uniforms: Record<string, number> = {};
            uniforms["u_vertexCount"] = this.vertexCount;
            return uniforms
        }
        super.draw()

    }

}

// Effects

class TEXEffect extends TEX {
    
    inTex?: TEX

    constructor(name: string, canvas: HTMLCanvasElement, inTex: TEX) {
        
        super(name, canvas)
        
        this.inTex = inTex

    }

}

class SaturationTEX extends TEXEffect {

    saturation: number = 1.0

    constructor(canvas: HTMLCanvasElement, inTex: TEX) {

        super("SaturationTEX", canvas, inTex)

    }

}

class BlendTEX extends TEXEffect {

    constructor(canvas: HTMLCanvasElement, inTex: TEX) {

        super("BlendTEX", canvas, inTex)

    }

}