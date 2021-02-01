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
var TEXSingleEffect = /** @class */ (function (_super) {
    __extends(TEXSingleEffect, _super);
    function TEXSingleEffect(shaderName, canvas) {
        var _this = _super.call(this, shaderName, canvas) || this;
        _this.subRender = function _() {
            // Sampler
            var samplerLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_sampler');
            this.gl.uniform1i(samplerLocation, 0);
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
        _super.prototype.pushPixels.call(this, tex, this);
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
        _super.prototype.render.call(this);
    };
    return TEXSingleEffect;
}(TEXEffect));
