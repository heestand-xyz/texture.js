const onlineShaderFolderURL: string = "https://heestand-xyz.github.io/texture.js/shaders/"

class Color {
    
    red: number;
    green: number;
    blue: number;
    alpha: number;

    static clear: Color = new Color(0.0, 0.0, 0.0, 0.0);
    static black: Color = new Color(0.0, 0.0, 0.0, 1.0);
    static white: Color = new Color(1.0, 1.0, 1.0, 1.0);

    constructor(red: number, green: number, blue: number, alpha: number) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
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
    
    static shaderFolder?: string

    shaderName: string
    
    canvas: HTMLCanvasElement
    gl: WebGLRenderingContext
    
    resolution!: Resolution
    // texture!: WebGLTexture
    // framebuffer!: WebGLFramebuffer

    shaderProgram!: WebGLProgram
    quadBuffer!: WebGLBuffer
    
    inputs: TEX[] = []
    outputs: TEX[] = []

    uniformBools: () => Record<string, boolean> = function _(): Record<string, boolean> { return {} }
    uniformInts: () => Record<string, number> = function _(): Record<string, number> { return {} }
    uniformFloats: () => Record<string, number> = function _(): Record<string, number> { return {} }
    uniformPositions: () => Record<string, Position> = function _(): Record<string, Position> { return {} }
    uniformResolutions: () => Record<string, Resolution> = function _(): Record<string, Resolution> { return {} }
    uniformColors: () => Record<string, Color> = function _(): Record<string, Color> { return {} }

    uniformArrayOfFloats: () => Record<string, number[]> = function _(): Record<string, number[]> { return {} }
    uniformArrayOfColors: () => Record<string, Color[]> = function _(): Record<string, Color[]> { return {} }

    subRender?: () => void

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
        var path: string = "";
        if (TEX.shaderFolder != null) {
            path = TEX.shaderFolder! + shaderName + ".glsl"
        } else {
            path = onlineShaderFolderURL + shaderName + ".glsl"
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

    // createTexture(gl: WebGLRenderingContext, resolution: Resolution, level: number = 0): WebGLTexture {
    //     const targetTexture = gl.createTexture()!;
    //     gl.bindTexture(gl.TEXTURE_2D, targetTexture);
    //     {
    //         const internalFormat = gl.RGBA;
    //         const border = 0;
    //         const format = gl.RGBA;
    //         const type = gl.UNSIGNED_BYTE;
    //         const data = null;
    //         gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, resolution.width, resolution.height, border, format, type, data);
    //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //     }
    //     return targetTexture
    // }

    // createFramebuffer(gl: WebGLRenderingContext, texture: WebGLTexture, level: number = 0): WebGLFramebuffer {

    //     const framebuffer: WebGLFramebuffer = gl.createFramebuffer()!;
    //     gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

    //     const attachmentPoint = gl.COLOR_ATTACHMENT0;
    //     gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture, level);
        
    //     return framebuffer

    // }
    
    createTexture(image: TexImageSource, index: number = 0): WebGLTexture {

        // console.log(this.shaderName + " - " + "createTextureFrom image index:", index)

        const texture = this.gl.createTexture()!;

        if (index == 0) {
            this.gl.activeTexture(this.gl.TEXTURE0)
        } else if (index == 1) {
            this.gl.activeTexture(this.gl.TEXTURE1)
        }

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
        gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
        // Clear the canvas before we start drawing on it.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    
    // Push Pixels

    pixelPushIndex: number = 0

    pushPixels(fromTex: TEX, toTex: TEX, index?: number) {
        const currentPixelPushIndex = toTex.pixelPushIndex + 1
        toTex.pixelPushIndex = currentPixelPushIndex
        fromTex.canvas.toBlob(function(blob) {
            if (currentPixelPushIndex != toTex.pixelPushIndex) { return; }
            const image: TexImageSource = new Image(fromTex.resolution.width, fromTex.resolution.height)
            image.src = URL.createObjectURL(blob)
            image.onload = () => {
                if (currentPixelPushIndex != toTex.pixelPushIndex) { return; }
                var inputIndex: number = 0
                if (index != null) {
                    inputIndex = index!
                } else {
                    inputIndex = toTex.indexOfInput(fromTex)
                }
                toTex.createTexture(image, inputIndex!)
                toTex.render()
            }
        });
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
        this.resolution = new Resolution(this.canvas.width, this.canvas.height)
        // if (this.texture != null) {
        //     this.gl.deleteTexture(this.texture)
        // }
        // this.texture = this.createTexture(this.gl, this.resolution)
        // if (this.framebuffer != null) {
        //     this.gl.deleteFramebuffer(this.framebuffer)
        // }
        // this.framebuffer = this.createFramebuffer(this.gl, this.texture)
    }

    // Render

    public render() {
        // console.log(this.shaderName + " - " + "render")
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
        const uniformPositions: Record<string, Position> = this.uniformPositions();
        for (var key in uniformPositions) {
            let value: Position = uniformPositions[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform2f(location, value.x, value.y);
        }

        // Resolutions
        const uniformResolutions: Record<string, Resolution> = this.uniformResolutions();
        for (var key in uniformResolutions) {
            let value: Resolution = uniformResolutions[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(this.shaderProgram, key)!;
            this.gl.uniform2i(location, value.width, value.height);
        }

        // Colors
        const uniformColors: Record<string, Color> = this.uniformColors();
        for (var key in uniformColors) {
            let value: Color = uniformColors[key];
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
        const uniformArrayOfColors: Record<string, Color[]> = this.uniformArrayOfColors();
        for (var key in uniformArrayOfColors) {
            let array: Color[] = uniformArrayOfColors[key];
            var flatArray: number[] = [];
            for (let index = 0; index < array.length; index++) {
                const color: Color = array[index];
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

// TEX Resource

class TEXResource extends TEX {
    
    resourceTexture?: WebGLTexture

    constructor(shaderName: string, canvas: HTMLCanvasElement) {
        
        super(shaderName, canvas)

        this.subRender = function _() {
            // Sampler
            const samplerLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_sampler');
            this.gl.uniform1i(samplerLocation, 0);
        }

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
        this.resourceTexture = this.createTexture(image)
        super.render()
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

class NoiseTEX extends TEXGenerator {
    
    _octaves: number = 1.0
    public get octaves(): number { return this._octaves }
    public set octaves(value: number) { this._octaves = value; super.render(); }

    _persistence: number = 0.5
    public get persistence(): number { return this._persistence }
    public set persistence(value: number) { this._persistence = value; super.render(); }

    _scale: number = 1.0
    public get scale(): number { return this._scale }
    public set scale(value: number) { this._scale = value; super.render(); }

    _zPosition: number = 0.0
    public get zPosition(): number { return this._zPosition }
    public set zPosition(value: number) { this._zPosition = value; super.render(); }

    _colored: boolean = false
    public get colored(): boolean { return this._colored }
    public set colored(value: boolean) { this._colored = value; super.render(); }

    constructor(canvas: HTMLCanvasElement) {
        
        super("NoiseTEX", canvas)

        this.uniformInts = function _(): Record<string, number> {
            let uniforms: Record<string, number> = {};
            uniforms["u_octaves"] = this.octaves;
            return uniforms
        }
        this.uniformFloats = function _(): Record<string, number> {
            let uniforms: Record<string, number> = {};
            uniforms["u_persistence"] = this.persistence;
            uniforms["u_scale"] = this.scale;
            uniforms["u_zPosition"] = this.zPosition;
            return uniforms
        }
        this.uniformBools = function _(): Record<string, boolean> {
            let uniforms: Record<string, boolean> = {};
            uniforms["u_colored"] = this.colored;
            return uniforms
        }
        super.render()

    }

}

enum GradientDirection {
    horizontal = 0,
    vertical = 1,
    radial = 2,
    angle = 3,
}

enum GradientExtend {
    zero = 0,
    hold = 1,
    loop = 2,
    mirror = 3,
}

class GradientColorStop {
    stop: number;
    color: Color;
    constructor(stop: number, color: Color) {
        this.stop = stop
        this.color = color
    }
}

class GradientTEX extends TEXGenerator {

    _direction: GradientDirection = GradientDirection.vertical
    public get direction(): GradientDirection { return this._direction }
    public set direction(value: GradientDirection) { this._direction = value; super.render(); }
    
    _scale: number = 1.0
    public get scale(): number { return this._scale }
    public set scale(value: number) { this._scale = value; super.render(); }
    
    _offset: number = 0.0
    public get offset(): number { return this._offset }
    public set offset(value: number) { this._offset = value; super.render(); }
    
    _extend: GradientExtend = GradientExtend.mirror
    public get extend(): GradientExtend { return this._extend }
    public set extend(value: GradientExtend) { this._extend = value; super.render(); }
    
    _colorStops: GradientColorStop[] = [new GradientColorStop(0.0, Color.black), new GradientColorStop(1.0, Color.white)]
    public get colorStops(): GradientColorStop[] { return this._colorStops }
    public set colorStops(value: GradientColorStop[]) { this._colorStops = value; super.render(); }
    
    // var colorStops: [ColorStop]
    
    constructor(canvas: HTMLCanvasElement) {
        
        super("GradientTEX", canvas)

        this.uniformInts = function _(): Record<string, number> {
            let uniforms: Record<string, number> = {};
            uniforms["u_direction"] = this.direction;
            uniforms["u_extend"] = this.extend;
            uniforms["u_colorStopCount"] = this.colorStops.length;
            return uniforms
        }
        this.uniformFloats = function _(): Record<string, number> {
            let uniforms: Record<string, number> = {};
            uniforms["u_scale"] = this.scale;
            uniforms["u_offset"] = this.offset;
            return uniforms
        }
        this.uniformArrayOfFloats = function _(): Record<string, number[]> {
            let uniforms: Record<string, number[]> = {};
            uniforms["u_stops"] = this.colorStops.map(x => x.stop);
            return uniforms
        }
        this.uniformArrayOfColors = function _(): Record<string, Color[]> {
            let uniforms: Record<string, Color[]> = {};
            uniforms["u_colors"] = this.colorStops.map(x => x.color);
            return uniforms
        }
        super.render()

    }

}

// TEX Effect

class TEXEffect extends TEX {

    _input?: TEX
    public get input(): TEX | undefined { return this._input }
    public set input(tex: TEX | undefined) {
        if (this._input != undefined) {
            this.disconnect(this.input!)
        }
        if (tex != undefined) {
            this.connect(tex)
        }
        this._input = tex;
    }

    constructor(shaderName: string, canvas: HTMLCanvasElement) {
        
        super(shaderName, canvas)
        
        this.subRender = function _() {

            // Sampler
            const samplerLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_sampler');
            this.gl.uniform1i(samplerLocation, 0);

        }

    }

    connect(tex: TEX) {
        tex.outputs.push(this)
        this.inputs = [tex]
        super.pushPixels(tex, this)
    }

    disconnect(tex: TEX) {
        for (let index = 0; index < tex.outputs.length; index++) {
            const output: TEX = tex.outputs[index];
            if (output == this) {
                tex.outputs.splice(index, 1);
                break;
            }
        }
        this.inputs = []
        super.render();
    }

}

class ColorShiftTEX extends TEXEffect {

    _hue: number = 0.0
    public get hue(): number { return this._hue }
    public set hue(value: number) { this._hue = value; super.render(); }

    _saturation: number = 1.0
    public get saturation(): number { return this._saturation }
    public set saturation(value: number) { this._saturation = value; super.render(); }

    _tintColor: Color = new Color(1.0, 1.0, 1.0, 1.0)
    public get tintColor(): Color { return this._tintColor }
    public set tintColor(value: Color) { this._tintColor = value; super.render(); }

    constructor(canvas: HTMLCanvasElement, input: TEX) {

        super("ColorShiftTEX", canvas)

        this.uniformFloats = function _(): Record<string, number> {
            let uniforms: Record<string, number> = {};
            uniforms["u_hue"] = this.hue;
            uniforms["u_saturation"] = this.saturation;
            return uniforms
        }
        this.uniformColors = function _(): Record<string, Color> {
            let uniforms: Record<string, Color> = {};
            uniforms["u_tintColor"] = this.tintColor;
            return uniforms
        }
        super.render()

    }

}

// TEX Merge Effect

class TEXMergeEffect extends TEX {

    _inputA?: TEX
    public get inputA(): TEX | undefined { return this._inputA }
    public set inputA(tex: TEX | undefined) {
        if (this._inputA != undefined) {
            this.disconnect(this.inputA!, 0)
        }
        if (tex != undefined) {
            this.connect(tex, 0)
        }
        this._inputA = tex;
    }

    _inputB?: TEX
    public get inputB(): TEX | undefined { return this._inputB }
    public set inputB(tex: TEX | undefined) {
        if (this._inputB != undefined) {
            this.disconnect(this.inputB!, 1)
        }
        if (tex != undefined) {
            this.connect(tex, 1)
        }
        this._inputB = tex;
    }


    constructor(shaderName: string, canvas: HTMLCanvasElement) {
        
        super(shaderName, canvas)
        
        this.subRender = function _() {

            // Sampler
            const samplerLocationA = this.gl.getUniformLocation(this.shaderProgram, 'u_samplerA');
            const samplerLocationB = this.gl.getUniformLocation(this.shaderProgram, 'u_samplerB');
            this.gl.uniform1i(samplerLocationA, 0);
            this.gl.uniform1i(samplerLocationB, 1);

        }

    }

    connect(tex: TEX, index: number) {
        tex.outputs.push(this)
        super.pushPixels(tex, this, index)
        if (this.inputs.length > 0) {
            this.inputs.splice(index, 0, tex)
        } else {
            this.inputs.push(tex)
        }
    }

    disconnect(tex: TEX, index: number) {
        for (let index = 0; index < tex.outputs.length; index++) {
            const output: TEX = tex.outputs[index];
            if (output == this) {
                tex.outputs.splice(index, 1);
                break;
            }
        }
        if (this.inputs.length > 1) {
            this.inputs.splice(index, 1)
        } else {
            this.inputs = []
        }
        super.render();
    }

}

class BlendTEX extends TEXMergeEffect {

    constructor(canvas: HTMLCanvasElement) {

        super("BlendTEX", canvas)

    }

}