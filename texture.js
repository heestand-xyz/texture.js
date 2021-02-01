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
var TEXRender = /** @class */ (function () {
    function TEXRender(tex, canvas) {
        var _this = this;
        this.tex = tex;
        tex.render = this;
        this.canvas = canvas;
        this.gl = this.canvas.getContext("webgl");
        tex.loadShader(function (source) {
            console.log(_this.tex.constructor.name + " (Render) - " + "Loaded");
            _this.setup(source);
            _this.draw();
        });
    }
    // Setup
    TEXRender.prototype.setup = function (fragmentShaderSource) {
        var vertexShaderSource = "attribute vec4 position; void main() { gl_Position = position; }";
        var vertexShader = this.createShader(this.gl, vertexShaderSource, this.gl.VERTEX_SHADER);
        var fragmentShader = this.createShader(this.gl, fragmentShaderSource, this.gl.FRAGMENT_SHADER);
        this.shaderProgram = this.createProgram(this.gl, vertexShader, fragmentShader);
        this.quadBuffer = this.createQuadBuffer(this.gl);
    };
    // Create
    TEXRender.prototype.createShader = function (gl, sourceCode, type) {
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
    TEXRender.prototype.createProgram = function (gl, vertexShader, fragmentShader) {
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            var info = gl.getProgramInfoLog(shaderProgram);
            console.log("GL Program Error:", info);
            throw 'GL Program Error.\n\n' + info;
        }
        return shaderProgram;
    };
    TEXRender.prototype.createQuadBuffer = function (gl) {
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
    // Render
    TEXRender.prototype.draw = function () {
        console.log(this.tex.constructor.name + " (Render) - " + "Draw");
        // console.log(this.shaderPath + " - " + "draw")
        // this.renderTo(this.framebuffer)
        this.drawTo(this.tex, null);
        // this.tex.outputs.forEach(output => {
        //     output.pushPixels(this, output)
        // });
    };
    TEXRender.prototype.drawTo = function (tex, framebuffer) {
        var _a;
        this.clear(this.gl);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
        // Vertex
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
        // Program
        this.gl.useProgram(this.shaderProgram);
        // Sub Render
        if (tex.subRender != undefined) {
            tex.subRender(this.gl, this.shaderProgram);
        }
        // Global Resolution
        var resolution = (_a = tex.chainResolution) !== null && _a !== void 0 ? _a : new TEXResolution(this.canvas.width, this.canvas.height);
        var resolutionLocation = this.gl.getUniformLocation(this.shaderProgram, "u_resolution");
        this.gl.uniform2i(resolutionLocation, resolution.width, resolution.height);
        // Bools
        var uniformBools = tex.uniformBools();
        for (var key in uniformBools) {
            var value = uniformBools[key];
            var location_1 = this.gl.getUniformLocation(this.shaderProgram, key);
            this.gl.uniform1i(location_1, value ? 1 : 0);
        }
        // Ints
        var uniformInts = tex.uniformInts();
        for (var key in uniformInts) {
            var value = uniformInts[key];
            var location_2 = this.gl.getUniformLocation(this.shaderProgram, key);
            this.gl.uniform1i(location_2, value);
        }
        // Floats
        var uniformFloats = tex.uniformFloats();
        for (var key in uniformFloats) {
            var value = uniformFloats[key];
            var location_3 = this.gl.getUniformLocation(this.shaderProgram, key);
            this.gl.uniform1f(location_3, value);
        }
        // Positions
        var uniformPositions = tex.uniformPositions();
        for (var key in uniformPositions) {
            var value = uniformPositions[key];
            var location_4 = this.gl.getUniformLocation(this.shaderProgram, key);
            this.gl.uniform2f(location_4, value.x, value.y);
        }
        // Resolutions
        var uniformResolutions = tex.uniformResolutions();
        for (var key in uniformResolutions) {
            var value = uniformResolutions[key];
            var location_5 = this.gl.getUniformLocation(this.shaderProgram, key);
            this.gl.uniform2i(location_5, value.width, value.height);
        }
        // Colors
        var uniformColors = tex.uniformColors();
        for (var key in uniformColors) {
            var value = uniformColors[key];
            var location_6 = this.gl.getUniformLocation(this.shaderProgram, key);
            this.gl.uniform4f(location_6, value.red, value.green, value.blue, value.alpha);
        }
        // Array of Floats
        var uniformArrayOfFloats = tex.uniformArrayOfFloats();
        for (var key in uniformArrayOfFloats) {
            var array = uniformArrayOfFloats[key];
            var list = new Float32Array(array);
            var location_7 = this.gl.getUniformLocation(this.shaderProgram, key);
            this.gl.uniform1fv(location_7, list);
        }
        // Array of Colors
        var uniformArrayOfColors = tex.uniformArrayOfColors();
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
    // Clear
    TEXRender.prototype.clear = function (gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    };
    return TEXRender;
}());
var onlineShaderSourceFolderURL = "https://heestand-xyz.github.io/texture.js/sources/shaders/";
var TEX = /** @class */ (function () {
    function TEX(shaderPath) {
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
        console.log(this.constructor.name + " - " + "Created");
        this.shaderPath = shaderPath;
    }
    Object.defineProperty(TEX.prototype, "chainResolution", {
        get: function () {
            if (this instanceof TEXContent) {
                var contentTex = this;
                if (contentTex.resolution != null) {
                    return contentTex.resolution;
                }
            }
            else if (this instanceof TEXEffect) {
                var effectTex = this;
                if (effectTex.inputs.length > 0) {
                    return effectTex.inputs[0].chainResolution;
                }
            }
            return null;
        },
        enumerable: false,
        configurable: true
    });
    TEX.prototype.refreshInputs = function () {
        console.log(this.constructor.name + " - " + "Refresh Inputs");
        console.log();
        this.refresh();
    };
    TEX.prototype.refresh = function () {
        var _a;
        console.log(this.constructor.name + " - " + "Refresh");
        (_a = this.render) === null || _a === void 0 ? void 0 : _a.draw();
    };
    // Load
    TEX.prototype.loadShader = function (loaded) {
        var path = "";
        if (TEX.shaderFolder != null) {
            path = TEX.shaderFolder + this.shaderPath;
        }
        else {
            path = onlineShaderSourceFolderURL + this.shaderPath;
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
    return TEX;
}());
var TEXContent = /** @class */ (function (_super) {
    __extends(TEXContent, _super);
    function TEXContent(shaderName) {
        return _super.call(this, shaderName) || this;
    }
    return TEXContent;
}(TEX));
var TEXGenerator = /** @class */ (function (_super) {
    __extends(TEXGenerator, _super);
    function TEXGenerator(shaderName, resolution) {
        var _this = _super.call(this, shaderName) || this;
        _this._backgroundColor = new TEXColor(0.0, 0.0, 0.0, 1.0);
        _this._color = new TEXColor(1.0, 1.0, 1.0, 1.0);
        _this._position = new TEXPosition(0.0, 0.0);
        _this.resolution = resolution;
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
        _super.prototype.refresh.call(_this);
        return _this;
    }
    Object.defineProperty(TEXGenerator.prototype, "backgroundColor", {
        get: function () { return this._backgroundColor; },
        set: function (value) { this._backgroundColor = value; _super.prototype.refresh.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TEXGenerator.prototype, "color", {
        get: function () { return this._color; },
        set: function (value) { this._color = value; _super.prototype.refresh.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TEXGenerator.prototype, "position", {
        get: function () { return this._position; },
        set: function (value) { this._position = value; _super.prototype.refresh.call(this); },
        enumerable: false,
        configurable: true
    });
    return TEXGenerator;
}(TEXContent));
var CircleTEX = /** @class */ (function (_super) {
    __extends(CircleTEX, _super);
    function CircleTEX(resolution) {
        var _this = _super.call(this, "content/generator/circle/CircleTEX.glsl", resolution) || this;
        _this._radius = 0.25;
        _this.uniformFloats = function _() {
            var uniforms = {};
            uniforms["u_radius"] = this.radius;
            return uniforms;
        };
        _super.prototype.refresh.call(_this);
        return _this;
    }
    Object.defineProperty(CircleTEX.prototype, "radius", {
        get: function () { return this._radius; },
        set: function (value) { this._radius = value; _super.prototype.refresh.call(this); },
        enumerable: false,
        configurable: true
    });
    return CircleTEX;
}(TEXGenerator));
// module.exports = CircleTEX
var GradientDirection;
(function (GradientDirection) {
    GradientDirection[GradientDirection["horizontal"] = 0] = "horizontal";
    GradientDirection[GradientDirection["vertical"] = 1] = "vertical";
    GradientDirection[GradientDirection["radial"] = 2] = "radial";
    GradientDirection[GradientDirection["angle"] = 3] = "angle";
})(GradientDirection || (GradientDirection = {}));
// module.exports = GradientDirection
var GradientExtend;
(function (GradientExtend) {
    GradientExtend[GradientExtend["zero"] = 0] = "zero";
    GradientExtend[GradientExtend["hold"] = 1] = "hold";
    GradientExtend[GradientExtend["loop"] = 2] = "loop";
    GradientExtend[GradientExtend["mirror"] = 3] = "mirror";
})(GradientExtend || (GradientExtend = {}));
// module.exports = GradientExtend
var GradientColorStop = /** @class */ (function () {
    function GradientColorStop(stop, color) {
        this.stop = stop;
        this.color = color;
    }
    return GradientColorStop;
}());
// module.exports = GradientColorStop
var GradientTEX = /** @class */ (function (_super) {
    __extends(GradientTEX, _super);
    // var colorStops: [ColorStop]
    function GradientTEX(resolution) {
        var _this = _super.call(this, "content/generator/gradient/GradientTEX.glsl", resolution) || this;
        _this._direction = GradientDirection.vertical;
        _this._scale = 1.0;
        _this._offset = 0.0;
        _this._extend = GradientExtend.mirror;
        _this._colorStops = [new GradientColorStop(0.0, TEXColor.black), new GradientColorStop(1.0, TEXColor.white)];
        _this.uniformInts = function _() {
            var uniforms = {};
            uniforms["u_direction"] = this.direction;
            uniforms["u_extend"] = this.extend;
            uniforms["u_colorStopCount"] = this.colorStops.length;
            return uniforms;
        };
        _this.uniformFloats = function _() {
            var uniforms = {};
            uniforms["u_scale"] = this.scale;
            uniforms["u_offset"] = this.offset;
            return uniforms;
        };
        _this.uniformArrayOfFloats = function _() {
            var uniforms = {};
            uniforms["u_stops"] = this.colorStops.map(function (x) { return x.stop; });
            return uniforms;
        };
        _this.uniformArrayOfColors = function _() {
            var uniforms = {};
            uniforms["u_colors"] = this.colorStops.map(function (x) { return x.color; });
            return uniforms;
        };
        _super.prototype.refresh.call(_this);
        return _this;
    }
    Object.defineProperty(GradientTEX.prototype, "direction", {
        get: function () { return this._direction; },
        set: function (value) { this._direction = value; _super.prototype.refresh.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GradientTEX.prototype, "scale", {
        get: function () { return this._scale; },
        set: function (value) { this._scale = value; _super.prototype.refresh.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GradientTEX.prototype, "offset", {
        get: function () { return this._offset; },
        set: function (value) { this._offset = value; _super.prototype.refresh.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GradientTEX.prototype, "extend", {
        get: function () { return this._extend; },
        set: function (value) { this._extend = value; _super.prototype.refresh.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GradientTEX.prototype, "colorStops", {
        get: function () { return this._colorStops; },
        set: function (value) { this._colorStops = value; _super.prototype.refresh.call(this); },
        enumerable: false,
        configurable: true
    });
    return GradientTEX;
}(TEXGenerator));
// module.exports = GradientTEX
var NoiseTEX = /** @class */ (function (_super) {
    __extends(NoiseTEX, _super);
    function NoiseTEX(resolution) {
        var _this = _super.call(this, "content/generator/noise/NoiseTEX.glsl", resolution) || this;
        _this._octaves = 1.0;
        _this._persistence = 0.5;
        _this._scale = 1.0;
        _this._zPosition = 0.0;
        _this._colored = false;
        _this.uniformInts = function _() {
            var uniforms = {};
            uniforms["u_octaves"] = this.octaves;
            return uniforms;
        };
        _this.uniformFloats = function _() {
            var uniforms = {};
            uniforms["u_persistence"] = this.persistence;
            uniforms["u_scale"] = this.scale;
            uniforms["u_zPosition"] = this.zPosition;
            return uniforms;
        };
        _this.uniformBools = function _() {
            var uniforms = {};
            uniforms["u_colored"] = this.colored;
            return uniforms;
        };
        _super.prototype.refresh.call(_this);
        return _this;
    }
    Object.defineProperty(NoiseTEX.prototype, "octaves", {
        get: function () { return this._octaves; },
        set: function (value) { this._octaves = value; _super.prototype.refresh.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NoiseTEX.prototype, "persistence", {
        get: function () { return this._persistence; },
        set: function (value) { this._persistence = value; _super.prototype.refresh.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NoiseTEX.prototype, "scale", {
        get: function () { return this._scale; },
        set: function (value) { this._scale = value; _super.prototype.refresh.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NoiseTEX.prototype, "zPosition", {
        get: function () { return this._zPosition; },
        set: function (value) { this._zPosition = value; _super.prototype.refresh.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NoiseTEX.prototype, "colored", {
        get: function () { return this._colored; },
        set: function (value) { this._colored = value; _super.prototype.refresh.call(this); },
        enumerable: false,
        configurable: true
    });
    return NoiseTEX;
}(TEXGenerator));
// module.exports = NoiseTEX
var PolygonTEX = /** @class */ (function (_super) {
    __extends(PolygonTEX, _super);
    // _antiAliased: boolean = true
    // public get antiAliased(): boolean { return this._antiAliased }
    // public set antiAliased(value: boolean) { this._antiAliased = value; super.refresh(); }
    function PolygonTEX(resolution) {
        var _this = _super.call(this, "content/generator/polygon/PolygonTEX.glsl", resolution) || this;
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
        _super.prototype.refresh.call(_this);
        return _this;
    }
    Object.defineProperty(PolygonTEX.prototype, "radius", {
        get: function () { return this._radius; },
        set: function (value) { this._radius = value; _super.prototype.refresh.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PolygonTEX.prototype, "rotation", {
        get: function () { return this._rotation; },
        set: function (value) { this._rotation = value; _super.prototype.refresh.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PolygonTEX.prototype, "vertexCount", {
        get: function () { return this._vertexCount; },
        set: function (value) { this._vertexCount = value; _super.prototype.refresh.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PolygonTEX.prototype, "cornerRadius", {
        get: function () { return this._cornerRadius; },
        set: function (value) { this._cornerRadius = value; _super.prototype.refresh.call(this); },
        enumerable: false,
        configurable: true
    });
    return PolygonTEX;
}(TEXGenerator));
// module.exports = PolygonTEX
var TEXResource = /** @class */ (function (_super) {
    __extends(TEXResource, _super);
    function TEXResource(shaderName) {
        var _this = _super.call(this, shaderName) || this;
        _this.subRender = function _(gl, program) {
            // Sampler
            var samplerLocation = gl.getUniformLocation(program, 'u_sampler');
            gl.uniform1i(samplerLocation, 0);
        };
        return _this;
    }
    return TEXResource;
}(TEXContent));
var ImageTEX = /** @class */ (function (_super) {
    __extends(ImageTEX, _super);
    function ImageTEX() {
        var _this = _super.call(this, "content/resource/image/ImageTEX.glsl") || this;
        _this._imageResolution = null;
        _this.uniformResolutions = function _() {
            var _a;
            var uniforms = {};
            uniforms["u_imageResolution"] = (_a = this.imageResolution) !== null && _a !== void 0 ? _a : new TEXResolution(1, 1);
            return uniforms;
        };
        return _this;
    }
    Object.defineProperty(ImageTEX.prototype, "imageResolution", {
        get: function () { return this._imageResolution; },
        set: function (value) { this._imageResolution = value; _super.prototype.refresh.call(this); },
        enumerable: false,
        configurable: true
    });
    ImageTEX.prototype.loadImageURL = function (url) {
        var image = new Image();
        image.src = url;
        var self = this;
        image.onload = function () {
            self.loadImage(image);
        };
    };
    ImageTEX.prototype.loadImage = function (image) {
        this.imageResolution = new TEXResolution(image.width, image.height);
        // this.resourceTexture = this.createTextureFromImage(image)
        _super.prototype.refresh.call(this);
    };
    ImageTEX.prototype.createTextureFromImage = function (gl, image) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        var level = 0;
        var format = gl.RGBA;
        var type = gl.UNSIGNED_BYTE;
        gl.texImage2D(gl.TEXTURE_2D, level, format, format, type, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        return texture;
    };
    return ImageTEX;
}(TEXResource));
// module.exports = ImageTEX;
var TEXEffect = /** @class */ (function (_super) {
    __extends(TEXEffect, _super);
    function TEXEffect(shaderName) {
        return _super.call(this, shaderName) || this;
    }
    return TEXEffect;
}(TEX));
var TEXMergerEffect = /** @class */ (function (_super) {
    __extends(TEXMergerEffect, _super);
    function TEXMergerEffect(shaderName) {
        var _this = _super.call(this, shaderName) || this;
        _this.subRender = function _(gl, program) {
            // Sampler
            var samplerLocationA = gl.getUniformLocation(program, 'u_samplerA');
            var samplerLocationB = gl.getUniformLocation(program, 'u_samplerB');
            gl.uniform1i(samplerLocationA, 0);
            gl.uniform1i(samplerLocationB, 1);
        };
        return _this;
    }
    Object.defineProperty(TEXMergerEffect.prototype, "inputA", {
        get: function () { return this._inputA; },
        set: function (tex) {
            if (this._inputA != undefined) {
                this.disconnect(this.inputA, 0);
            }
            if (tex != undefined) {
                this.connect(tex, 0);
            }
            this._inputA = tex;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TEXMergerEffect.prototype, "inputB", {
        get: function () { return this._inputB; },
        set: function (tex) {
            if (this._inputB != undefined) {
                this.disconnect(this.inputB, 1);
            }
            if (tex != undefined) {
                this.connect(tex, 1);
            }
            this._inputB = tex;
        },
        enumerable: false,
        configurable: true
    });
    TEXMergerEffect.prototype.connect = function (tex, index) {
        tex.outputs.push(this);
        if (this.inputs.length > 0) {
            this.inputs.splice(index, 0, tex);
        }
        else {
            this.inputs.push(tex);
        }
        _super.prototype.refreshInputs.call(this);
    };
    TEXMergerEffect.prototype.disconnect = function (tex, index) {
        for (var index_1 = 0; index_1 < tex.outputs.length; index_1++) {
            var output = tex.outputs[index_1];
            if (output == this) {
                tex.outputs.splice(index_1, 1);
                break;
            }
        }
        if (this.inputs.length > 1) {
            this.inputs.splice(index, 1);
        }
        else {
            this.inputs = [];
        }
        _super.prototype.refreshInputs.call(this);
    };
    return TEXMergerEffect;
}(TEXEffect));
var BlendTEX = /** @class */ (function (_super) {
    __extends(BlendTEX, _super);
    function BlendTEX() {
        return _super.call(this, "effects/merger/blend/BlendTEX.glsl") || this;
    }
    return BlendTEX;
}(TEXMergerEffect));
// module.exports = BlendTEX
var TEXSingleEffect = /** @class */ (function (_super) {
    __extends(TEXSingleEffect, _super);
    function TEXSingleEffect(shaderName) {
        var _this = _super.call(this, shaderName) || this;
        _this.subRender = function _(gl, program) {
            // Sampler
            var samplerLocation = gl.getUniformLocation(program, 'u_sampler');
            gl.uniform1i(samplerLocation, 0);
        };
        return _this;
    }
    Object.defineProperty(TEXSingleEffect.prototype, "input", {
        get: function () { return this._input; },
        set: function (tex) {
            if (this._input != undefined) {
                this.disconnect(this.input);
            }
            if (tex != undefined) {
                this.connect(tex);
            }
            this._input = tex;
        },
        enumerable: false,
        configurable: true
    });
    TEXSingleEffect.prototype.connect = function (tex) {
        tex.outputs.push(this);
        this.inputs = [tex];
        _super.prototype.refreshInputs.call(this);
    };
    TEXSingleEffect.prototype.disconnect = function (tex) {
        for (var index = 0; index < tex.outputs.length; index++) {
            var output = tex.outputs[index];
            if (output == this) {
                tex.outputs.splice(index, 1);
                break;
            }
        }
        this.inputs = [];
        _super.prototype.refreshInputs.call(this);
    };
    return TEXSingleEffect;
}(TEXEffect));
var ColorShiftTEX = /** @class */ (function (_super) {
    __extends(ColorShiftTEX, _super);
    function ColorShiftTEX() {
        var _this = _super.call(this, "effects/single/colorShift/ColorShiftTEX.glsl") || this;
        _this._hue = 0.0;
        _this._saturation = 1.0;
        _this._tintColor = new TEXColor(1.0, 1.0, 1.0, 1.0);
        _this.uniformFloats = function _() {
            var uniforms = {};
            uniforms["u_hue"] = this.hue;
            uniforms["u_saturation"] = this.saturation;
            return uniforms;
        };
        _this.uniformColors = function _() {
            var uniforms = {};
            uniforms["u_tintColor"] = this.tintColor;
            return uniforms;
        };
        _super.prototype.refresh.call(_this);
        return _this;
    }
    Object.defineProperty(ColorShiftTEX.prototype, "hue", {
        get: function () { return this._hue; },
        set: function (value) { this._hue = value; _super.prototype.refresh.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorShiftTEX.prototype, "saturation", {
        get: function () { return this._saturation; },
        set: function (value) { this._saturation = value; _super.prototype.refresh.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorShiftTEX.prototype, "tintColor", {
        get: function () { return this._tintColor; },
        set: function (value) { this._tintColor = value; _super.prototype.refresh.call(this); },
        enumerable: false,
        configurable: true
    });
    return ColorShiftTEX;
}(TEXSingleEffect));
// module.exports = ColorShiftTEX
var TEXColor = /** @class */ (function () {
    function TEXColor(red, green, blue, alpha) {
        if (alpha === void 0) { alpha = 1.0; }
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
    TEXColor.clear = new TEXColor(0.0, 0.0, 0.0, 0.0);
    TEXColor.black = new TEXColor(0.0, 0.0, 0.0, 1.0);
    TEXColor.white = new TEXColor(1.0, 1.0, 1.0, 1.0);
    return TEXColor;
}());
// module.exports = TEXColor;
var TEXPosition = /** @class */ (function () {
    function TEXPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    return TEXPosition;
}());
// module.exports = TEXPosition;
var TEXResolution = /** @class */ (function () {
    function TEXResolution(width, height) {
        this.width = width;
        this.height = height;
    }
    TEXResolution.fullHD = new TEXResolution(1920, 1080);
    TEXResolution.ultraHD = new TEXResolution(3840, 2160);
    return TEXResolution;
}());
// module.exports = TEXResolution;
