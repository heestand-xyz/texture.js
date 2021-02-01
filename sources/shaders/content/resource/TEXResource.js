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
var TEXResource = /** @class */ (function (_super) {
    __extends(TEXResource, _super);
    function TEXResource(shaderName, canvas) {
        var _this = _super.call(this, shaderName, canvas) || this;
        _this.subRender = function _() {
            // Sampler
            var samplerLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_sampler');
            this.gl.uniform1i(samplerLocation, 0);
        };
        return _this;
    }
    return TEXResource;
}(TEX));
