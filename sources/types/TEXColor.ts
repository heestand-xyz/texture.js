
class TEXColor {
    
    red: number;
    green: number;
    blue: number;
    alpha: number;

    static clear: TEXColor = new TEXColor(0.0, 0.0, 0.0, 0.0);
    static black: TEXColor = new TEXColor(0.0, 0.0, 0.0, 1.0);
    static white: TEXColor = new TEXColor(1.0, 1.0, 1.0, 1.0);

    constructor(red: number, green: number, blue: number, alpha: number = 1.0) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }

}

// module.exports = TEXColor;
