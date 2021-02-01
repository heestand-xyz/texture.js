"use strict";
var TEXResolution = /** @class */ (function () {
    function TEXResolution(width, height) {
        this.width = width;
        this.height = height;
    }
    TEXResolution.fullHD = new TEXResolution(1920, 1080);
    TEXResolution.ultraHD = new TEXResolution(3840, 2160);
    return TEXResolution;
}());
module.exports = TEXResolution;
