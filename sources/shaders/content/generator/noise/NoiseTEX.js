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
var NoiseTEX = /** @class */ (function (_super) {
    __extends(NoiseTEX, _super);
    function NoiseTEX(canvas) {
        var _this = _super.call(this, "content/generator/NoiseTEX", canvas) || this;
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
        _super.prototype.render.call(_this);
        return _this;
    }
    Object.defineProperty(NoiseTEX.prototype, "octaves", {
        get: function () { return this._octaves; },
        set: function (value) { this._octaves = value; _super.prototype.render.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NoiseTEX.prototype, "persistence", {
        get: function () { return this._persistence; },
        set: function (value) { this._persistence = value; _super.prototype.render.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NoiseTEX.prototype, "scale", {
        get: function () { return this._scale; },
        set: function (value) { this._scale = value; _super.prototype.render.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NoiseTEX.prototype, "zPosition", {
        get: function () { return this._zPosition; },
        set: function (value) { this._zPosition = value; _super.prototype.render.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NoiseTEX.prototype, "colored", {
        get: function () { return this._colored; },
        set: function (value) { this._colored = value; _super.prototype.render.call(this); },
        enumerable: false,
        configurable: true
    });
    return NoiseTEX;
}(TEXGenerator));
module.exports = NoiseTEX;
