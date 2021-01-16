"use strict";
// class Resolution {
//     width: number
//     height: number
//     constructor(width: number, height: number) {
//         this.width = width
//         this.height = height
//     }
// }
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
var TEX = /** @class */ (function () {
    function TEX(canvas, shaderSource) {
        this.canvas = canvas;
        this.gl = this.canvas.getContext("webgl2");
        var vertexShaderSource = 'attribute vec4 position;\n' +
            'void main() {\n' +
            '  gl_Position = position;\n' +
            '}\n';
        this.vertexShader = this.createShader(this.gl, vertexShaderSource, this.gl.VERTEX_SHADER);
        this.fragmentShader = this.createShader(this.gl, shaderSource, this.gl.FRAGMENT_SHADER);
    }
    TEX.prototype.createShader = function (gl, sourceCode, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, sourceCode);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            var info = gl.getShaderInfoLog(shader);
            throw 'Could not compile WebGL program. \n\n' + info;
        }
        return shader;
    };
    return TEX;
}());
var TEXIn = /** @class */ (function (_super) {
    __extends(TEXIn, _super);
    function TEXIn(canvas, inTex, shaderSource) {
        var _this = _super.call(this, canvas, shaderSource) || this;
        _this.inTex = inTex;
        return _this;
    }
    return TEXIn;
}(TEX));
// Content
var CircleTEX = /** @class */ (function (_super) {
    __extends(CircleTEX, _super);
    function CircleTEX(canvas, radius) {
        var _this = _super.call(this, canvas, "") || this;
        _this.radius = radius;
        return _this;
        // this.context.beginPath();
        // this.context.arc(100, 75, 50, 0, 2 * Math.PI);
        // this.context.stroke();
    }
    return CircleTEX;
}(TEX));
// Effects
var SaturationTEX = /** @class */ (function (_super) {
    __extends(SaturationTEX, _super);
    function SaturationTEX(canvas, inTex, saturation) {
        var _this = _super.call(this, canvas, inTex, "") || this;
        _this.saturation = saturation;
        return _this;
    }
    return SaturationTEX;
}(TEXIn));
