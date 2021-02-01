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
var ImageTEX = /** @class */ (function (_super) {
    __extends(ImageTEX, _super);
    function ImageTEX(canvas, image) {
        var _this = _super.call(this, "content/resource/ImageTEX", canvas) || this;
        _this._imageResolution = null;
        _this.image = image;
        _this.uniformResolutions = function _() {
            var _a;
            var uniforms = {};
            uniforms["u_imageResolution"] = (_a = this.imageResolution) !== null && _a !== void 0 ? _a : new TEXResolution(1, 1);
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
        this.imageResolution = new TEXResolution(image.width, image.height);
        this.resourceTexture = this.createTexture(image);
        _super.prototype.render.call(this);
    };
    return ImageTEX;
}(TEXResource));
module.exports = ImageTEX;
