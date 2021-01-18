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

class Resolution {
    width: number
    height: number
    constructor(width: number, height: number) {
        this.width = width
        this.height = height
    }
}

// TEX

class TEX {
    
    static shaderFolder =  "shaders/"

    shaderName: string
    
    canvas: HTMLCanvasElement
    gl: WebGLRenderingContext
    
    resolution!: Resolution
    texture!: WebGLTexture
    framebuffer!: WebGLFramebuffer

    shaderProgram!: WebGLProgram
    quadBuffer!: WebGLBuffer    

    uniformBools: () => Record<string, boolean> = function _(): Record<string, boolean> { return {} }
    uniformInts: () => Record<string, number> = function _(): Record<string, number> { return {} }
    uniformFloats: () => Record<string, number> = function _(): Record<string, number> { return {} }
    uniformPositions: () => Record<string, Position> = function _(): Record<string, Position> { return {} }
    uniformResolutions: () => Record<string, Resolution> = function _(): Record<string, Resolution> { return {} }
    uniformColors: () => Record<string, Color> = function _(): Record<string, Color> { return {} }

    constructor(shaderName: string, canvas: HTMLCanvasElement) {

        this.shaderName = shaderName

        this.canvas = canvas
        
        this.gl = this.canvas.getContext("webgl")!

        this.layout()
        this.load(shaderName, (source: string) : void => {
            this.setup(source)
            this.render()    
        })

    }

    // Setup

    load(shaderName: string, loaded: (_: string) => (void)) {
        let path: string = TEX.shaderFolder + shaderName + ".frag"
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

    createTexture(gl: WebGLRenderingContext, resolution: Resolution, level: number = 0): WebGLTexture {
        const targetTexture = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, targetTexture);
        {
            const internalFormat = gl.RGBA;
            const border = 0;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;
            const data = null;
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, resolution.width, resolution.height, border, format, type, data);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        return targetTexture
    }

    createFramebuffer(gl: WebGLRenderingContext, texture: WebGLTexture, level: number = 0): WebGLFramebuffer {

        const framebuffer: WebGLFramebuffer = gl.createFramebuffer()!;
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

        const attachmentPoint = gl.COLOR_ATTACHMENT0;
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture, level);
        
        return framebuffer

    }

    clear(gl: WebGLRenderingContext) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
        // Clear the canvas before we start drawing on it.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    // Layout

    public layout() {
        this.resolution = new Resolution(this.canvas.width, this.canvas.height)
        if (this.texture != null) {
            this.gl.deleteTexture(this.texture)
        }
        this.texture = this.createTexture(this.gl, this.resolution)
        if (this.framebuffer != null) {
            this.gl.deleteFramebuffer(this.framebuffer)
        }
        this.framebuffer = this.createFramebuffer(this.gl, this.texture)
    }

    // Render

    public render() {
        this.renderTo(this.framebuffer)
        this.renderTo(null)
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

        // Resolution

        let resolutionLocation: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, "u_resolution")!
        this.gl.uniform2i(resolutionLocation, this.resolution.width, this.resolution.height)
        
        // Sampler
        const samplerLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_sampler');
        this.gl.uniform1i(samplerLocation, 0);

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

        // Resolutions
        const uniformResolutions: Record<string, Resolution> = this.uniformResolutions();
        for (var key in uniformResolutions) {
            let value = uniformResolutions[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform2i(location, value.width, value.height);
        }

        // Colors
        const uniformColors: Record<string, Color> = this.uniformColors();
        for (var key in uniformColors) {
            let value = uniformColors[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform4f(location, value.red, value.green, value.blue, value.alpha);
        }

        // Texture

        // this.texture

        // Final

        {
            const offset = 0;
            const vertexCount = 4;
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount);
        }

    }

}

// TEX Resource

class TEXResource extends TEX {
    
    resourceTexture?: WebGLTexture

    constructor(shaderName: string, canvas: HTMLCanvasElement) {
        
        super(shaderName, canvas)

    }

}

class ImageTEX extends TEXResource {
    
    image: TexImageSource | null

    _imageResolution: Resolution | null = null
    public get imageResolution(): Resolution | null { return this._imageResolution }
    public set imageResolution(value: Resolution | null) { this._imageResolution = value; super.render(); }
    
    constructor(canvas: HTMLCanvasElement, image: TexImageSource | null) {
        
        super("ImageTEX", canvas)

        this.image = image

        this.uniformResolutions = function _(): Record<string, Resolution> {
            let uniforms: Record<string, Resolution> = {};
            uniforms["u_imageResolution"] = this.imageResolution ?? new Resolution(1, 1);
            return uniforms
        }

        if (image != null) {
            this.loadImage(image!)
        }

    }

    public loadImage(image: TexImageSource) {
        this.imageResolution = new Resolution(image!.width, image!.height)
        this.resourceTexture = this.loadTexture(image)
        super.render()
    }
    
    loadTexture(image: TexImageSource): WebGLTexture {

        const texture = this.gl.createTexture()!;
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

        const level = 0;
        const format = this.gl.RGBA;
        const type = this.gl.UNSIGNED_BYTE;
        this.gl.texImage2D(this.gl.TEXTURE_2D, level, format, format, type, image);

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);

        return texture

    }

}

// TEX Generator

class TEXGenerator extends TEX {

    _backgroundColor: Color = new Color(0.0, 0.0, 0.0, 1.0)
    public get backgroundColor(): Color { return this._backgroundColor }
    public set backgroundColor(value: Color) { this._backgroundColor = value; super.render(); }
    
    _color: Color = new Color(1.0, 1.0, 1.0, 1.0)
    public get color(): Color { return this._color }
    public set color(value: Color) { this._color = value; super.render(); }

    _position: Position = new Position(0.0, 0.0)
    public get position(): Position { return this._position }
    public set position(value: Position) { this._position = value; super.render(); }

    constructor(shaderName: string, canvas: HTMLCanvasElement) {
        
        super(shaderName, canvas)

        this.uniformPositions = function _(): Record<string, Position> {
            let uniforms: Record<string, Position> = {};
            uniforms["u_position"] = this.position;
            return uniforms
        }
        this.uniformColors = function _(): Record<string, Color> {
            let uniforms: Record<string, Color> = {};
            uniforms["u_backgroundColor"] = this.backgroundColor;
            uniforms["u_color"] = this.color;
            return uniforms
        }
        super.render()

    }

}

class CircleTEX extends TEXGenerator {

    _radius: number = 0.25
    public get radius(): number { return this._radius }
    public set radius(value: number) { this._radius = value; super.render(); }

    constructor(canvas: HTMLCanvasElement) {
        
        super("CircleTEX", canvas)

        this.uniformFloats = function _(): Record<string, number> {
            let uniforms: Record<string, number> = {};
            uniforms["u_radius"] = this.radius;
            return uniforms
        }
        super.render()

    }

}

class PolygonTEX extends TEXGenerator {

    _radius: number = 0.25
    public get radius(): number { return this._radius }
    public set radius(value: number) { this._radius = value; super.render(); }

    _rotation: number = 0.0
    public get rotation(): number { return this._rotation }
    public set rotation(value: number) { this._rotation = value; super.render(); }

    _vertexCount: number = 3
    public get vertexCount(): number { return this._vertexCount }
    public set vertexCount(value: number) { this._vertexCount = value; super.render(); }

    _cornerRadius: number = 0.0
    public get cornerRadius(): number { return this._cornerRadius }
    public set cornerRadius(value: number) { this._cornerRadius = value; super.render(); }
    
    // _antiAliased: boolean = true
    // public get antiAliased(): boolean { return this._antiAliased }
    // public set antiAliased(value: boolean) { this._antiAliased = value; super.render(); }
    
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
        // this.uniformBools = function _(): Record<string, boolean> {
        //     let uniforms: Record<string, boolean> = {};
        //     uniforms["u_antiAliased"] = this.antiAliased;
        //     return uniforms
        // }
        super.render()

    }

}

// TEX Effect

class TEXEffect extends TEX {

    _input?: TEX
    public get input(): TEX | undefined { return this._input }
    public set input(value: TEX | undefined) { this._input = value; this.connection(); }

    constructor(shaderName: string, canvas: HTMLCanvasElement) {
        
        super(shaderName, canvas)
        
    }

    connection() {
        console.log(this.shaderName + " Connect:", this.input)
        super.render()
    }
    
    // loadTexture(): WebGLTexture {

    //     const texture = this.gl.createTexture()!;
    //     this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    //     const level = 0;
    //     const format = this.gl.RGBA;
    //     const type = this.gl.UNSIGNED_BYTE;
    //     this.gl.texImage2D(this.gl.TEXTURE_2D, level, format, format, type, image);

    //     this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    //     this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    //     this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);

    //     return texture

    // }

}

class ColorShiftTEX extends TEXEffect {

    _hue: number = 0.0
    public get hue(): number { return this._hue }
    public set hue(value: number) { this._hue = value; super.render(); }

    _saturation: number = 1.0
    public get saturation(): number { return this._saturation }
    public set saturation(value: number) { this._saturation = value; super.render(); }

    constructor(canvas: HTMLCanvasElement, input: TEX) {

        super("ColorShiftTEX", canvas)

        this.uniformFloats = function _(): Record<string, number> {
            let uniforms: Record<string, number> = {};
            uniforms["u_hue"] = this.hue;
            uniforms["u_saturation"] = this.saturation;
            return uniforms
        }
        super.render()

    }

}

// TEX Merge Effect

class TEXMergeEffect extends TEX {

    inputA?: TEX
    inputB?: TEX

    constructor(shaderName: string, canvas: HTMLCanvasElement) {
        
        super(shaderName, canvas)
        
    }

}

class BlendTEX extends TEXMergeEffect {

    constructor(canvas: HTMLCanvasElement) {

        super("BlendTEX", canvas)

    }

}