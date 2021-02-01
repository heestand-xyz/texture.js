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
var GradientDirection;
(function (GradientDirection) {
    GradientDirection[GradientDirection["horizontal"] = 0] = "horizontal";
    GradientDirection[GradientDirection["vertical"] = 1] = "vertical";
    GradientDirection[GradientDirection["radial"] = 2] = "radial";
    GradientDirection[GradientDirection["angle"] = 3] = "angle";
})(GradientDirection || (GradientDirection = {}));
module.exports = GradientDirection;
var GradientExtend;
(function (GradientExtend) {
    GradientExtend[GradientExtend["zero"] = 0] = "zero";
    GradientExtend[GradientExtend["hold"] = 1] = "hold";
    GradientExtend[GradientExtend["loop"] = 2] = "loop";
    GradientExtend[GradientExtend["mirror"] = 3] = "mirror";
})(GradientExtend || (GradientExtend = {}));
module.exports = GradientExtend;
var GradientColorStop = /** @class */ (function () {
    function GradientColorStop(stop, color) {
        this.stop = stop;
        this.color = color;
    }
    return GradientColorStop;
}());
module.exports = GradientColorStop;
var GradientTEX = /** @class */ (function (_super) {
    __extends(GradientTEX, _super);
    // var colorStops: [ColorStop]
    function GradientTEX(canvas) {
        var _this = _super.call(this, "content/generator/GradientTEX", canvas) || this;
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
        _super.prototype.render.call(_this);
        return _this;
    }
    Object.defineProperty(GradientTEX.prototype, "direction", {
        get: function () { return this._direction; },
        set: function (value) { this._direction = value; _super.prototype.render.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GradientTEX.prototype, "scale", {
        get: function () { return this._scale; },
        set: function (value) { this._scale = value; _super.prototype.render.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GradientTEX.prototype, "offset", {
        get: function () { return this._offset; },
        set: function (value) { this._offset = value; _super.prototype.render.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GradientTEX.prototype, "extend", {
        get: function () { return this._extend; },
        set: function (value) { this._extend = value; _super.prototype.render.call(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GradientTEX.prototype, "colorStops", {
        get: function () { return this._colorStops; },
        set: function (value) { this._colorStops = value; _super.prototype.render.call(this); },
        enumerable: false,
        configurable: true
    });
    return GradientTEX;
}(TEXGenerator));
module.exports = GradientTEX;
