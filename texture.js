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
var TEX = /** @class */ (function () {
    function TEX(width, height) {
        this.width = width;
        this.height = height;
    }
    return TEX;
}());
var TEXIn = /** @class */ (function (_super) {
    __extends(TEXIn, _super);
    function TEXIn(inTex) {
        var _this = _super.call(this, inTex.width, inTex.height) || this;
        _this.inTex = inTex;
        return _this;
    }
    return TEXIn;
}(TEX));
// Content
var CircleTEX = /** @class */ (function (_super) {
    __extends(CircleTEX, _super);
    function CircleTEX(width, height, radius) {
        var _this = _super.call(this, width, height) || this;
        _this.radius = radius;
        return _this;
    }
    return CircleTEX;
}(TEX));
// Effects
var SaturationTEX = /** @class */ (function (_super) {
    __extends(SaturationTEX, _super);
    function SaturationTEX(inTex, saturation) {
        var _this = _super.call(this, inTex) || this;
        _this.saturation = saturation;
        return _this;
    }
    return SaturationTEX;
}(TEXIn));
// Test
var c = new CircleTEX(100, 100, 0.5);
