
class TEXRender {

    tex: TEX

    canvas: HTMLCanvasElement
    gl: WebGLRenderingContext
    
    quadBuffer!: WebGLBuffer
    
    constructor(tex: TEX, canvas: HTMLCanvasElement) {

        console.log(tex.constructor.name + " (Render) - " + "Init")

        this.tex = tex
        tex.render = this

        this.canvas = canvas
        
        this.gl = this.canvas.getContext("webgl")!

        this.quadBuffer = this.createQuadBuffer(this.gl)  

        const self = this

        tex.reverseCrawl(function _(crawlTex, done) {
            
            crawlTex.setup(self.gl, done)

        }, function completion() {

            console.log(tex.constructor.name + " (Render) - " + "Setup")

            self.draw()

            // tex.reverseContentCrawl(function _(crawlTex, done) {
            //     crawlTex.refresh()
            //     done()
            // }, function completion() {})

        })

    }

    // Create

    createQuadBuffer(gl: WebGLRenderingContext): WebGLBuffer {

        const positionBuffer = gl.createBuffer()!;
      
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      
        const positions = [
            -1.0, 1.0,
            1.0, 1.0,
            -1.0, -1.0,
            1.0, -1.0,
        ];
      
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

    // Resolution
    
    resolutionFor(tex: TEX): TEXResolution {
        return tex.firstResolution ?? new TEXResolution(this.canvas.width, this.canvas.height)
    }

    // Clear

    clear(gl: WebGLRenderingContext) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    // Prep

    prepTexture(tex: TEX): WebGLTexture {

        if (tex.texture != null) {
            this.gl.deleteTexture(tex.texture)
        }
        tex.texture = this.createEmptyTexture(this.gl, this.resolutionFor(tex))

        return tex.texture!

    }

    prepFramebuffer(tex: TEX): WebGLFramebuffer {

        const texture = tex.texture ?? this.prepTexture(tex)

        if (tex.framebuffer != null) {
            this.gl.deleteFramebuffer(tex.framebuffer)
        }
        tex.framebuffer = this.createFramebuffer(this.gl, texture)

        return tex.framebuffer!

    }

    // Draw

    public draw() {

        console.log(this.tex.constructor.name + " (Render) - " + "Draw >->->->")

        if (this.tex instanceof TEXEffect) {
            let texEffect = this.tex as TEXEffect
            this.drawInputs(texEffect)
        }
        this.drawTo(this.tex, null)

    }

    drawInputs(texEffect: TEXEffect) {

        console.log(this.tex.constructor.name + " (Render) - " + "Draw Inputs >->->", texEffect.constructor.name)

        for (let index = 0; index < texEffect.texInputs.length; index++) {
            const texEffectInput = texEffect.texInputs[index];
            
            console.log(this.tex.constructor.name + " (Render) - " + "Draw Input >->", index, texEffect.constructor.name, ">>>", texEffectInput.constructor.name)

            if (texEffectInput instanceof TEXEffect) {
                let texEffectInputEffect = texEffectInput as TEXEffect
                this.drawInputs(texEffectInputEffect)
            }

            const inputTexture: WebGLTexture = this.prepTexture(texEffectInput)
            const inputFramebuffer: WebGLFramebuffer = this.prepFramebuffer(texEffectInput)
            
            this.drawTo(texEffectInput, inputFramebuffer)
            
            if (index == 0) {
                this.gl.activeTexture(this.gl.TEXTURE0)
            } else if (index == 1) {
                this.gl.activeTexture(this.gl.TEXTURE1)
            }

        }

    }
    
    drawTo(tex: TEX, framebufferTarget: WebGLFramebuffer | null) {

        if (tex.program == null) {
            console.log("texture.js TEXRender draw failed: TEX (" + tex.constructor.name + ") shader program is null.")
            return
        }

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebufferTarget);

        this.clear(this.gl)

        // Vertex
        
        {
            const numComponents = 2; 
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const attribPosition = this.gl.getAttribLocation(tex.program!, 'position');
            const offset = 0;
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

        // Program
        
        this.gl.useProgram(tex.program!);

        // Sub Render
        
        if (tex.subRender != undefined) {
            tex.subRender!(this.gl, tex.program!);
        }

        // Global Resolution
        let resolution: TEXResolution = this.resolutionFor(tex)
        let resolutionLocation: WebGLUniformLocation = this.gl.getUniformLocation(tex.program!, "u_resolution")!
        this.gl.uniform2i(resolutionLocation, resolution.width, resolution.height)
        
        // Bools
        const uniformBools: Record<string, boolean> = tex.uniformBools();
        for (var key in uniformBools) {
            let value: Boolean = uniformBools[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(tex.program!, key)!;
            this.gl.uniform1i(location, value ? 1 : 0);
        }

        // Ints
        const uniformInts: Record<string, number> = tex.uniformInts();
        for (var key in uniformInts) {
            let value: number = uniformInts[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(tex.program!, key)!;
            this.gl.uniform1i(location, value);
        }

        // Floats
        const uniformFloats: Record<string, number> = tex.uniformFloats();
        for (var key in uniformFloats) {
            let value: number = uniformFloats[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(tex.program!, key)!;
            this.gl.uniform1f(location, value);
        }

        // Positions
        const uniformPositions: Record<string, TEXPosition> = tex.uniformPositions();
        for (var key in uniformPositions) {
            let value: TEXPosition = uniformPositions[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(tex.program!, key)!;
            this.gl.uniform2f(location, value.x, value.y);
        }

        // Resolutions
        const uniformResolutions: Record<string, TEXResolution> = tex.uniformResolutions();
        for (var key in uniformResolutions) {
            let value: TEXResolution = uniformResolutions[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(tex.program!, key)!;
            this.gl.uniform2i(location, value.width, value.height);
        }

        // Colors
        const uniformColors: Record<string, TEXColor> = tex.uniformColors();
        for (var key in uniformColors) {
            let value: TEXColor = uniformColors[key];
            let location: WebGLUniformLocation = this.gl.getUniformLocation(tex.program!, key)!;
            this.gl.uniform4f(location, value.red, value.green, value.blue, value.alpha);
        }

        // Array of Floats
        const uniformArrayOfFloats: Record<string, number[]> = tex.uniformArrayOfFloats();
        for (var key in uniformArrayOfFloats) {
            let array: number[] = uniformArrayOfFloats[key];
            let list: Float32List = new Float32Array(array);
            let location: WebGLUniformLocation = this.gl.getUniformLocation(tex.program!, key)!;
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
            let location: WebGLUniformLocation = this.gl.getUniformLocation(tex.program!, key)!;
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