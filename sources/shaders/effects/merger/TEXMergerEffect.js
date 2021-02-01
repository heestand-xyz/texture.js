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
var TEXMergerEffect = /** @class */ (function (_super) {
    __extends(TEXMergerEffect, _super);
    function TEXMergerEffect(shaderName, canvas) {
        var _this = _super.call(this, shaderName, canvas) || this;
        _this.subRender = function _() {
            // Sampler
            var samplerLocationA = this.gl.getUniformLocation(this.shaderProgram, 'u_samplerA');
            var samplerLocationB = this.gl.getUniformLocation(this.shaderProgram, 'u_samplerB');
            this.gl.uniform1i(samplerLocationA, 0);
            this.gl.uniform1i(samplerLocationB, 1);
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
        _super.prototype.pushPixels.call(this, tex, this, index);
        if (this.inputs.length > 0) {
            this.inputs.splice(index, 0, tex);
        }
        else {
            this.inputs.push(tex);
        }
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
        _super.prototype.render.call(this);
    };
    return TEXMergerEffect;
}(TEXEffect));
