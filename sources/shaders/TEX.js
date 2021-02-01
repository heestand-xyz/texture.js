"use strict";
var onlineShaderSourceFolderURL = "https://heestand-xyz.github.io/texture.js/sources/shaders/";
var TEX = /** @class */ (function () {
    function TEX(shaderPath, canvas) {
        var _this = this;
        this.inputs = [];
        this.outputs = [];
        this.uniformBools = function _() { return {}; };
        this.uniformInts = function _() { return {}; };
        this.uniformFloats = function _() { return {}; };
        this.uniformPositions = function _() { return {}; };
        this.uniformResolutions = function _() { return {}; };
        this.uniformColors = function _() { return {}; };
        this.uniformArrayOfFloats = function _() { return {}; };
        this.uniformArrayOfColors = function _() { return {}; };
        this.shaderPath = shaderPath;
        this.canvas = canvas;
        this.gl = this.canvas.getContext("webgl");
        this.layout();
        this.load(shaderPath, function (source) {
            _this.setup(source);
            _this.render();
        });
    }
    // Setup
    TEX.prototype.load = function (shaderPath, loaded) {
        var path = "";
        if (TEX.shaderFolder != null) {
            path = TEX.shaderFolder + shaderPath + ".glsl";
        }
        else {
            path = onlineShaderSourceFolderURL + shaderPath + ".glsl";
        }
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", path, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    loaded(rawFile.responseText);
                }
            }
        };
        rawFile.send(null);
    };
    TEX.prototype.setup = function (fragmentShaderSource) {
        var vertexShaderSource = "attribute vec4 position; void main() { gl_Position = position; }";
        var vertexShader = this.createShader(this.gl, vertexShaderSource, this.gl.VERTEX_SHADER);
        var fragmentShader = this.createShader(this.gl, fragmentShaderSource, this.gl.FRAGMENT_SHADER);
        this.shaderProgram = this.createProgram(this.gl, vertexShader, fragmentShader);
        this.quadBuffer = this.createQuadBuffer(this.gl);
    };
    // Create
    TEX.prototype.createProgram = function (gl, vertexShader, fragmentShader) {
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        // If creating the shader program failed, alert
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            var info = gl.getProgramInfoLog(shaderProgram);
            console.log("GL Program Error:", info);
            throw 'GL Program Error.\n\n' + info;
        }
        return shaderProgram;
    };
    TEX.prototype.createShader = function (gl, sourceCode, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, sourceCode);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            var info = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            console.log("GL Shader Error:", info);
            throw 'GL Shader Error.\n\n' + info;
        }
        return shader;
    };
    TEX.prototype.createQuadBuffer = function (gl) {
        // Create a buffer for the square's positions.
        var positionBuffer = gl.createBuffer();
        // Select the positionBuffer as the one to apply buffer
        // operations to from here out.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // Now create an array of positions for the square.
        var positions = [
            -1.0, 1.0,
            1.0, 1.0,
            -1.0, -1.0,
            1.0, -1.0,
        ];
        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        return positionBuffer;
    };
    TEX.prototype.createEmptyTexture = function (gl, resolution) {
        var emptyTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, emptyTexture);
        {
            var internalFormat = gl.RGBA;
            var border = 0;
            var level = 0;
            var format = gl.RGBA;
            var type = gl.UNSIGNED_BYTE;
            var data = null;
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, resolution.width, resolution.height, border, format, type, data);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        return emptyTexture;
    };
    TEX.prototype.createFramebuffer = function (gl, texture, index) {
        if (index === void 0) { index = 0; }
        var framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        var attachmentPoint = gl.COLOR_ATTACHMENT0;
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture, 0);
        return framebuffer;
    };
    TEX.prototype.activateTexture = function (texture, index) {
        if (index == 0) {
            this.gl.activeTexture(this.gl.TEXTURE0);
        }
        else if (index == 1) {
            this.gl.activeTexture(this.gl.TEXTURE1);
        }
    };
    TEX.prototype.createTexture = function (image, index) {
        if (index === void 0) { index = 0; }
        var texture = this.gl.createTexture();
        this.activateTexture(texture, index);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        var level = 0;
        var format = this.gl.RGBA;
        var type = this.gl.UNSIGNED_BYTE;
        this.gl.texImage2D(this.gl.TEXTURE_2D, level, format, format, type, image);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        return texture;
    };
    TEX.prototype.clear = function (gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    };
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
    TEX.prototype.pushPixels = function (fromTex, _toTex, index) {
        var inputIndex = 0;
        if (index != null) {
            inputIndex = index;
        }
        else {
            inputIndex = this.indexOfInput(fromTex);
        }
        this.layout();
        this.render();
    };
    TEX.prototype.indexOfInput = function (tex) {
        for (var index = 0; index < this.inputs.length; index++) {
            var input = this.inputs[index];
            if (tex == input) {
                return index;
            }
        }
        return 0;
    };
    // Layout
    TEX.prototype.layout = function () {
        this.resolution = new TEXResolution(this.canvas.width, this.canvas.height);
        if (this.texture != null) {
            this.gl.deleteTexture(this.texture);
        }
        this.texture = this.createEmptyTexture(this.gl, this.resolution);
        if (this.framebuffer != null) {
            this.gl.deleteFramebuffer(this.framebuffer);
        }
        this.framebuffer = this.createFramebuffer(this.gl, this.texture);
    };
    // Render
    TEX.prototype.render = function () {
        var _this = this;
        // console.log(this.shaderPath + " - " + "render")
        // this.renderTo(this.framebuffer)
        this.renderTo(null);
        this.outputs.forEach(function (output) {
            output.pushPixels(_this, output);
        });
    };
    TEX.prototype.renderTo = function (framebuffer) {
        this.clear(this.gl);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
        // Prep
        {
            var numComponents = 2; // pull out 2 values per iteration
            var type = this.gl.FLOAT; // the data in the buffer is 32bit floats
            var normalize = false; // don't normalize
            var stride = 0; // how many bytes to get from one set of values to the next
            // 0 = use type and numComponents above
            var attribPosition = this.gl.getAttribLocation(this.shaderProgram, 'position');
            var offset = 0; // how many bytes inside the buffer to start from
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
            this.gl.vertexAttribPointer(attribPosition, numComponents, type, normalize, stride, offset);
            this.gl.enableVertexAttribArray(attribPosition);
        }
        this.gl.useProgram(this.shaderProgram);
        if (this.subRender != undefined) {
            this.subRender();
        }
        // Global Resolution
        var resolutionLocation = this.gl.getUniformLocation(this.shaderProgram, "u_resolution");
        this.gl.uniform2i(resolutionLocation, this.resolution.width, this.resolution.height);
        // Bools
        var uniformBools = this.uniformBools();
        for (var key in uniformBools) {
            var value = uniformBools[key];
            var location_1 = this.gl.getUniformLocation(this.shaderProgram, key);
            this.gl.uniform1i(location_1, value ? 1 : 0);
        }
        // Ints
        var uniformInts = this.uniformInts();
        for (var key in uniformInts) {
            var value = uniformInts[key];
            var location_2 = this.gl.getUniformLocation(this.shaderProgram, key);
            this.gl.uniform1i(location_2, value);
        }
        // Floats
        var uniformFloats = this.uniformFloats();
        for (var key in uniformFloats) {
            var value = uniformFloats[key];
            var location_3 = this.gl.getUniformLocation(this.shaderProgram, key);
            this.gl.uniform1f(location_3, value);
        }
        // Positions
        var uniformPositions = this.uniformPositions();
        for (var key in uniformPositions) {
            var value = uniformPositions[key];
            var location_4 = this.gl.getUniformLocation(this.shaderProgram, key);
            this.gl.uniform2f(location_4, value.x, value.y);
        }
        // Resolutions
        var uniformResolutions = this.uniformResolutions();
        for (var key in uniformResolutions) {
            var value = uniformResolutions[key];
            var location_5 = this.gl.getUniformLocation(this.shaderProgram, key);
            this.gl.uniform2i(location_5, value.width, value.height);
        }
        // Colors
        var uniformColors = this.uniformColors();
        for (var key in uniformColors) {
            var value = uniformColors[key];
            var location_6 = this.gl.getUniformLocation(this.shaderProgram, key);
            this.gl.uniform4f(location_6, value.red, value.green, value.blue, value.alpha);
        }
        // Array of Floats
        var uniformArrayOfFloats = this.uniformArrayOfFloats();
        for (var key in uniformArrayOfFloats) {
            var array = uniformArrayOfFloats[key];
            var list = new Float32Array(array);
            var location_7 = this.gl.getUniformLocation(this.shaderProgram, key);
            this.gl.uniform1fv(location_7, list);
        }
        // Array of Colors
        var uniformArrayOfColors = this.uniformArrayOfColors();
        for (var key in uniformArrayOfColors) {
            var array = uniformArrayOfColors[key];
            var flatArray = [];
            for (var index = 0; index < array.length; index++) {
                var color = array[index];
                flatArray.push(color.red);
                flatArray.push(color.green);
                flatArray.push(color.blue);
                flatArray.push(color.alpha);
            }
            var list = new Float32Array(flatArray);
            var location_8 = this.gl.getUniformLocation(this.shaderProgram, key);
            this.gl.uniform4fv(location_8, list);
        }
        // Final
        {
            var offset = 0;
            var vertexCount = 4;
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount);
        }
    };
    return TEX;
}());
