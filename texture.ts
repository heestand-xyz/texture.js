class TEX {

    width: number
    height: number

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
    }

}

class TEXIn extends TEX {
    
    inTex?: TEX

    constructor(inTex: TEX) {
        super(inTex.width, inTex.height)
        this.inTex = inTex
    }

}

// Content

class CircleTEX extends TEX {

    radius: number

    constructor(width: number, height: number, radius: number) {
        super(width, height)
        this.radius = radius
    }

}

// Effects

class SaturationTEX extends TEXIn {

    saturation: number

    constructor(inTex: TEX, saturation: number) {
        super(inTex)
        this.saturation = saturation
    }

}

// Test

const c: TEX = new CircleTEX(100, 100, 0.5)