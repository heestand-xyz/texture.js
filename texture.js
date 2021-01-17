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
var Position = /** @class */ (function () {
    function Position(x, y) {
        this.x = x;
        this.y = y;
    }
    return Position;
}());
// TEX
var TEX = /** @class */ (function () {
    function TEX(name, canvas) {
        var _this = this;
        this.uniformBools = function _() { return {}; };
        this.uniformInts = function _() { return {}; };
        this.uniformFloats = function _() { return {}; };
        this.uniformPositions = function _() { return {}; };
        this.uniformColors = function _() { return {}; };
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
        var resolutionLocation = this.gl.getUniformLocation(this.shaderProgram, "u_resolution");
        this.gl.uniform2i(resolutionLocation, this.canvas.width, this.canvas.height);
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
        // Colors
        var uniformColors = this.uniformColors();
        for (var key in uniformColors) {
            var value = uniformColors[key];
            var location_5 = this.gl.getUniformLocation(this.shaderProgram, key);
            this.gl.uniform4f(location_5, value.red, value.green, value.blue, value.alpha);
        }
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
        _this._backgroundColor = new Color(0.0, 0.0, 0.0, 1.0);
        _this._foregroundColor = new Color(1.0, 1.0, 1.0, 1.0);
        _this._position = new Position(0.0, 0.0);
        _this.uniformPositions = function _() {
            var uniforms = {};
            uniforms["u_position"] = this.position;
            return uniforms;
        };
        _this.uniformColors = function _() {
            var uniforms = {};
            uniforms["u_backgroundColor"] = this.backgroundColor;
            uniforms["u_foregroundColor"] = this.foregroundColor;
            return uniforms;
        };
        _super.prototype.draw.call(_this);
        return _this;
    }
    Object.defineProperty(TEXContent.prototype, "backgroundColor", {
        get: function () { return this._backgroundColor; },
        set: function (value) { this._backgroundColor = value; this.draw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TEXContent.prototype, "foregroundColor", {
        get: function () { return this._foregroundColor; },
        set: function (value) { this._foregroundColor = value; this.draw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TEXContent.prototype, "position", {
        get: function () { return this._position; },
        set: function (value) { this._position = value; this.draw(); },
        enumerable: false,
        configurable: true
    });
    return TEXContent;
}(TEX));
var CircleTEX = /** @class */ (function (_super) {
    __extends(CircleTEX, _super);
    function CircleTEX(canvas, radius) {
        var _this = _super.call(this, "CircleTEX", canvas) || this;
        _this._radius = radius;
        _this.uniformFloats = function _() {
            var uniforms = {};
            uniforms["u_radius"] = this.radius;
            return uniforms;
        };
        _super.prototype.draw.call(_this);
        return _this;
    }
    Object.defineProperty(CircleTEX.prototype, "radius", {
        get: function () { return this._radius; },
        set: function (value) { this._radius = value; this.draw(); },
        enumerable: false,
        configurable: true
    });
    return CircleTEX;
}(TEXContent));
var PolygonTEX = /** @class */ (function (_super) {
    __extends(PolygonTEX, _super);
    function PolygonTEX(canvas, radius) {
        var _this = _super.call(this, "PolygonTEX", canvas) || this;
        _this._radius = radius;
        _this.uniformFloats = function _() {
            var uniforms = {};
            uniforms["u_radius"] = this.radius;
            return uniforms;
        };
        _super.prototype.draw.call(_this);
        return _this;
    }
    Object.defineProperty(PolygonTEX.prototype, "radius", {
        get: function () { return this._radius; },
        set: function (value) { this._radius = value; this.draw(); },
        enumerable: false,
        configurable: true
    });
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
