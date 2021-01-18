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
var Resolution = /** @class */ (function () {
    function Resolution(width, height) {
        this.width = width;
        this.height = height;
    }
    return Resolution;
}());
// TEX
var TEX = /** @class */ (function () {
    function TEX(shaderName, canvas) {
        var _this = this;
        this.uniformBools = function _() { return {}; };
        this.uniformInts = function _() { return {}; };
        this.uniformFloats = function _() { return {}; };
        this.uniformPositions = function _() { return {}; };
        this.uniformResolutions = function _() { return {}; };
        this.uniformColors = function _() { return {}; };
        this.shaderName = shaderName;
        this.canvas = canvas;
        this.gl = this.canvas.getContext("webgl");
        this.layout();
        this.load(shaderName, function (source) {
            _this.setup(source);
            _this.render();
        });
    }
    // Setup
    TEX.prototype.load = function (shaderName, loaded) {
        var path = TEX.shaderFolder + shaderName + ".frag";
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
    TEX.prototype.createTexture = function (gl, resolution, level) {
        if (level === void 0) { level = 0; }
        var targetTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, targetTexture);
        {
            var internalFormat = gl.RGBA;
            var border = 0;
            var format = gl.RGBA;
            var type = gl.UNSIGNED_BYTE;
            var data = null;
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, resolution.width, resolution.height, border, format, type, data);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        return targetTexture;
    };
    TEX.prototype.createFramebuffer = function (gl, texture, level) {
        if (level === void 0) { level = 0; }
        var framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        var attachmentPoint = gl.COLOR_ATTACHMENT0;
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture, level);
        return framebuffer;
    };
    TEX.prototype.clear = function (gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        // Clear the canvas before we start drawing on it.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    };
    // Layout
    TEX.prototype.layout = function () {
        this.resolution = new Resolution(this.canvas.width, this.canvas.height);
        if (this.texture != null) {
            this.gl.deleteTexture(this.texture);
        }
        this.texture = this.createTexture(this.gl, this.resolution);
        if (this.framebuffer != null) {
            this.gl.deleteFramebuffer(this.framebuffer);
        }
        this.framebuffer = this.createFramebuffer(this.gl, this.texture);
    };
    // Render
    TEX.prototype.render = function () {
        this.renderTo(this.framebuffer);
        this.renderTo(null);
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
        // Resolution
        var resolutionLocation = this.gl.getUniformLocation(this.shaderProgram, "u_resolution");
        this.gl.uniform2i(resolutionLocation, this.resolution.width, this.resolution.height);
        // Sampler
        var samplerLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_sampler');
        this.gl.uniform1i(samplerLocation, 0);
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
        // Texture
        // this.texture
        // Final
        {
            var offset = 0;
            var vertexCount = 4;
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount);
        }
    };
    TEX.shaderFolder = "shaders/";
    return TEX;
}());
// TEX Resource
var TEXResource = /** @class */ (function (_super) {
    __extends(TEXResource, _super);
    function TEXResource(shaderName, canvas) {
        return _super.call(this, shaderName, canvas) || this;
    }
    return TEXResource;
}(TEX));
var ImageTEX = /** @class */ (function (_super) {
    __extends(ImageTEX, _super);
    function ImageTEX(canvas, image) {
        var _this = _super.call(this, "ImageTEX", canvas) || this;
        _this._imageResolution = null;
        _this.image = image;
        _this.uniformResolutions = function _() {
            var _a;
            var uniforms = {};
            uniforms["u_imageResolution"] = (_a = this.imageResolution) !== null && _a !== void 0 ? _a : new Resolution(1, 1);
            return uniforms;
        };
        if (image != null) {
            _this.loadImage(image);
        }
        return _this;
    }
    Object.defineProperty(ImageTEX.prototype, "imageResolution", {
        get: function () { return this._imageResolution; },
        set: function (value) { this._imageResolution = value; _super.prototype.render.call(this); },
        enumerable: false,
        configurable: true
    });
    ImageTEX.prototype.loadImage = function (image) {
        this.imageResolution = new Resolution(image.width, image.height);
        this.resourceTexture = this.loadTexture(image);
        _super.prototype.render.call(this);
    };
    ImageTEX.prototype.loadTexture = function (image) {
        var texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        var level = 0;
        var format = this.gl.RGBA;
        var type = this.gl.UNSIGNED_BYTE;
        this.gl.texImage2D(this.gl.TEXTURE_2D, level, format, format, type, image);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        return texture;
    };
    return ImageTEX;
}(TEXResource));
// TEX Generator
var TEXGenerator = /** @class */ (function (_super) {
    __extends(TEXGenerator, _super);
    function TEXGenerator(shaderName, canvas) {
        var _this = _super.call(this, shaderName, canvas) || this;
        _this._backgroundColor = new Color(0.0, 0.0, 0.0, 1.0);
        _this._color = new Color(1.0, 1.0, 1.0, 1.0);
        _this._position = new Position(0.0, 0.0);
        _this.uniformPositions = function _() {
            var uniforms = {};
            uniforms["u_position"] = this.position;
            return uniforms;
        };
        _this.uniformColors = function _() {
            var uniforms = {};
            uniforms["u_backgroundColor"] = this.backgroundColor;
            uniforms["u_color"] = this.color;
            return uniforms;
        };
        _super.prototype.render.call(_this);
        return _this;
    }
    Object.defineProperty(TEXGenerator.prototype, "backgroundColor", {
        get: function () { return this._backgroundColor; },
        set: function (value) { this._backgroundColor = value; _super.prototype.render.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TEXGenerator.prototype, "color", {
        get: function () { return this._color; },
        set: function (value) { this._color = value; _super.prototype.render.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TEXGenerator.prototype, "position", {
        get: function () { return this._position; },
        set: function (value) { this._position = value; _super.prototype.render.call(this); },
        enumerable: false,
        configurable: true
    });
    return TEXGenerator;
}(TEX));
var CircleTEX = /** @class */ (function (_super) {
    __extends(CircleTEX, _super);
    function CircleTEX(canvas) {
        var _this = _super.call(this, "CircleTEX", canvas) || this;
        _this._radius = 0.25;
        _this.uniformFloats = function _() {
            var uniforms = {};
            uniforms["u_radius"] = this.radius;
            return uniforms;
        };
        _super.prototype.render.call(_this);
        return _this;
    }
    Object.defineProperty(CircleTEX.prototype, "radius", {
        get: function () { return this._radius; },
        set: function (value) { this._radius = value; _super.prototype.render.call(this); },
        enumerable: false,
        configurable: true
    });
    return CircleTEX;
}(TEXGenerator));
var PolygonTEX = /** @class */ (function (_super) {
    __extends(PolygonTEX, _super);
    // _antiAliased: boolean = true
    // public get antiAliased(): boolean { return this._antiAliased }
    // public set antiAliased(value: boolean) { this._antiAliased = value; super.render(); }
    function PolygonTEX(canvas) {
        var _this = _super.call(this, "PolygonTEX", canvas) || this;
        _this._radius = 0.25;
        _this._rotation = 0.0;
        _this._vertexCount = 3;
        _this._cornerRadius = 0.0;
        _this.uniformFloats = function _() {
            var uniforms = {};
            uniforms["u_radius"] = this.radius;
            uniforms["u_rotation"] = this.rotation;
            uniforms["u_cornerRadius"] = this.cornerRadius;
            return uniforms;
        };
        _this.uniformInts = function _() {
            var uniforms = {};
            uniforms["u_vertexCount"] = this.vertexCount;
            return uniforms;
        };
        // this.uniformBools = function _(): Record<string, boolean> {
        //     let uniforms: Record<string, boolean> = {};
        //     uniforms["u_antiAliased"] = this.antiAliased;
        //     return uniforms
        // }
        _super.prototype.render.call(_this);
        return _this;
    }
    Object.defineProperty(PolygonTEX.prototype, "radius", {
        get: function () { return this._radius; },
        set: function (value) { this._radius = value; _super.prototype.render.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PolygonTEX.prototype, "rotation", {
        get: function () { return this._rotation; },
        set: function (value) { this._rotation = value; _super.prototype.render.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PolygonTEX.prototype, "vertexCount", {
        get: function () { return this._vertexCount; },
        set: function (value) { this._vertexCount = value; _super.prototype.render.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PolygonTEX.prototype, "cornerRadius", {
        get: function () { return this._cornerRadius; },
        set: function (value) { this._cornerRadius = value; _super.prototype.render.call(this); },
        enumerable: false,
        configurable: true
    });
    return PolygonTEX;
}(TEXGenerator));
// TEX Effect
var TEXEffect = /** @class */ (function (_super) {
    __extends(TEXEffect, _super);
    function TEXEffect(shaderName, canvas) {
        return _super.call(this, shaderName, canvas) || this;
    }
    Object.defineProperty(TEXEffect.prototype, "input", {
        get: function () { return this._input; },
        set: function (value) { this._input = value; this.connection(); },
        enumerable: false,
        configurable: true
    });
    TEXEffect.prototype.connection = function () {
        console.log(this.shaderName + " Connect:", this.input);
        _super.prototype.render.call(this);
    };
    return TEXEffect;
}(TEX));
var ColorShiftTEX = /** @class */ (function (_super) {
    __extends(ColorShiftTEX, _super);
    function ColorShiftTEX(canvas, input) {
        var _this = _super.call(this, "ColorShiftTEX", canvas) || this;
        _this._hue = 0.0;
        _this._saturation = 1.0;
        _this.uniformFloats = function _() {
            var uniforms = {};
            uniforms["u_hue"] = this.hue;
            uniforms["u_saturation"] = this.saturation;
            return uniforms;
        };
        _super.prototype.render.call(_this);
        return _this;
    }
    Object.defineProperty(ColorShiftTEX.prototype, "hue", {
        get: function () { return this._hue; },
        set: function (value) { this._hue = value; _super.prototype.render.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorShiftTEX.prototype, "saturation", {
        get: function () { return this._saturation; },
        set: function (value) { this._saturation = value; _super.prototype.render.call(this); },
        enumerable: false,
        configurable: true
    });
    return ColorShiftTEX;
}(TEXEffect));
// TEX Merge Effect
var TEXMergeEffect = /** @class */ (function (_super) {
    __extends(TEXMergeEffect, _super);
    function TEXMergeEffect(shaderName, canvas) {
        return _super.call(this, shaderName, canvas) || this;
    }
    return TEXMergeEffect;
}(TEX));
var BlendTEX = /** @class */ (function (_super) {
    __extends(BlendTEX, _super);
    function BlendTEX(canvas) {
        return _super.call(this, "BlendTEX", canvas) || this;
    }
    return BlendTEX;
}(TEXMergeEffect));
