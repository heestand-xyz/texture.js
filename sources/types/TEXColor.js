"use strict";
var TEXColor = /** @class */ (function () {
    function TEXColor(red, green, blue, alpha) {
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
module.exports = TEXColor;
