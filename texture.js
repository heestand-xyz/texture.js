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
var Color = /** @class */ (function () {
    function Color(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
    return Color;
}());
var UniformType;
(function (UniformType) {
    UniformType[UniformType["bool"] = 0] = "bool";
    UniformType[UniformType["int"] = 1] = "int";
    UniformType[UniformType["float"] = 2] = "float";
})(UniformType || (UniformType = {}));
// TEX
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
    TEX.prototype.loadShader = function (name, loaded) {
        var path = TEX.shaderFolder + name + ".frag";
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
        this.draw();
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
    TEX.prototype.draw = function () {
        this.clear(this.gl);
        console.log("texture.js draw " + this.name);
        // {
        //     const numComponents = 2;  // pull out 2 values per iteration
        //     const type = this.gl.FLOAT;    // the data in the buffer is 32bit floats
        //     const normalize = false;  // don't normalize
        //     const stride = 0;         // how many bytes to get from one set of values to the next
        //                             // 0 = use type and numComponents above
        //     const attribPosition = this.gl.getAttribLocation(this.shaderProgram, 'position');
        //     const offset = 0;         // how many bytes inside the buffer to start from
        //     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
        //     this.gl.vertexAttribPointer(
        //         attribPosition,
        //         numComponents,
        //         type,
        //         normalize,
        //         stride,
        //         offset);
        //     this.gl.enableVertexAttribArray(attribPosition);
        // }
        this.gl.useProgram(this.shaderProgram);
        var resolutionLocation = this.gl.getUniformLocation(this.shaderProgram, "u_resolution");
        this.gl.uniform2i(resolutionLocation, this.canvas.width, this.canvas.height);
        {
            var offset = 0;
            var vertexCount = 4;
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount);
        }
    };
    TEX.shaderFolder = "shaders/";
    return TEX;
}());
// Content
var TEXContent = /** @class */ (function (_super) {
    __extends(TEXContent, _super);
    function TEXContent(name, canvas) {
        var _this = _super.call(this, name, canvas) || this;
        _this.backgroundColor = new Color(0.0, 0.0, 0.0, 1.0);
        _this.foregroundColor = new Color(1.0, 1.0, 1.0, 1.0);
        return _this;
    }
    return TEXContent;
}(TEX));
var CircleTEX = /** @class */ (function (_super) {
    __extends(CircleTEX, _super);
    function CircleTEX(canvas, radius) {
        var _this = _super.call(this, "CircleTEX", canvas) || this;
        _this.radius = radius;
        return _this;
    }
    return CircleTEX;
}(TEXContent));
var PolygonTEX = /** @class */ (function (_super) {
    __extends(PolygonTEX, _super);
    function PolygonTEX(canvas, radius) {
        var _this = _super.call(this, "PolygonTEX", canvas) || this;
        _this.radius = radius;
        return _this;
    }
    return PolygonTEX;
}(TEXContent));
// Effects
var TEXEffect = /** @class */ (function (_super) {
    __extends(TEXEffect, _super);
    function TEXEffect(name, canvas, inTex) {
        var _this = _super.call(this, name, canvas) || this;
        _this.inTex = inTex;
        return _this;
    }
    return TEXEffect;
}(TEX));
var SaturationTEX = /** @class */ (function (_super) {
    __extends(SaturationTEX, _super);
    function SaturationTEX(canvas, inTex, saturation) {
        var _this = _super.call(this, "SaturationTEX", canvas, inTex) || this;
        _this.saturation = saturation;
        return _this;
    }
    return SaturationTEX;
}(TEXEffect));
var BlendTEX = /** @class */ (function (_super) {
    __extends(BlendTEX, _super);
    function BlendTEX(canvas, inTex) {
        return _super.call(this, "BlendTEX", canvas, inTex) || this;
    }
    return BlendTEX;
}(TEXEffect));
