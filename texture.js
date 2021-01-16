"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var shaderFolder = "../shaders/";
var TEX = /** @class */ (function () {
    function TEX(name, canvas) {
        var _this = this;
        this.name = name;
        this.canvas = canvas;
        this.gl = this.canvas.getContext("webgl");
        this.loadShader(name, function (source) {
            _this.setup(source);
        });
    }
    TEX.prototype.setup = function (fragmentShaderSource) {
        var vertexShaderSource = "attribute vec4 position; void main() { gl_Position = position; }";
        var vertexShader = this.createShader(this.gl, vertexShaderSource, this.gl.VERTEX_SHADER);
        var fragmentShader = this.createShader(this.gl, fragmentShaderSource, this.gl.FRAGMENT_SHADER);
        var shaderProgram = this.createProgram(this.gl, vertexShader, fragmentShader);
        var quadBuffer = this.createQuadBuffer(this.gl);
        this.clear(this.gl);
        this.draw(this.gl, shaderProgram, quadBuffer);
    };
    // readShader(name: string): string {
    //     let path: string = "shaders/" + name + ".frag"
    //     return fs.readFileSync(path, "utf8")
    // }
    TEX.prototype.loadShader = function (name, loaded) {
        var path = shaderFolder + name + ".frag";
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
    TEX.prototype.clear = function (gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        // Clear the canvas before we start drawing on it.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    };
    TEX.prototype.draw = function (gl, program, quadBuffer) {
        {
            var numComponents = 2; // pull out 2 values per iteration
            var type = gl.FLOAT; // the data in the buffer is 32bit floats
            var normalize = false; // don't normalize
            var stride = 0; // how many bytes to get from one set of values to the next
            // 0 = use type and numComponents above
            var attribPosition = this.gl.getAttribLocation(program, 'position');
            var offset = 0; // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
            gl.vertexAttribPointer(attribPosition, numComponents, type, normalize, stride, offset);
            gl.enableVertexAttribArray(attribPosition);
        }
        // Tell WebGL to use our program when drawing
        gl.useProgram(program);
        {
            var offset = 0;
            var vertexCount = 4;
            gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        }
    };
    return TEX;
}());
var TEXIn = /** @class */ (function (_super) {
    __extends(TEXIn, _super);
    function TEXIn(name, canvas, inTex) {
        var _this = _super.call(this, name, canvas) || this;
        _this.inTex = inTex;
        return _this;
    }
    return TEXIn;
}(TEX));
// Content
var CircleTEX = /** @class */ (function (_super) {
    __extends(CircleTEX, _super);
    function CircleTEX(canvas, radius) {
        var _this = _super.call(this, "CircleTEX", canvas) || this;
        _this.radius = radius;
        return _this;
    }
    return CircleTEX;
}(TEX));
// Effects
var SaturationTEX = /** @class */ (function (_super) {
    __extends(SaturationTEX, _super);
    function SaturationTEX(canvas, inTex, saturation) {
        var _this = _super.call(this, "SaturationTEX", canvas, inTex) || this;
        _this.saturation = saturation;
        return _this;
    }
    return SaturationTEX;
}(TEXIn));
