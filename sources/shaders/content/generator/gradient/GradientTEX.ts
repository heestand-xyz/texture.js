
enum GradientTEXDirection {
    horizontal = 0,
    vertical = 1,
    radial = 2,
    angle = 3,
}
// module.exports = GradientTEXDirection

enum GradientTEXExtend {
    zero = 0,
    hold = 1,
    loop = 2,
    mirror = 3,
}
// module.exports = GradientTEXExtend

class GradientTEXColorStop {
    stop: number;
    color: TEXColor;
    constructor(stop: number, color: TEXColor) {
        this.stop = stop
        this.color = color
    }
}
// module.exports = GradientTEXColorStop

class GradientTEX extends TEXGenerator {

    _direction: GradientTEXDirection = GradientTEXDirection.vertical
    public get direction(): GradientTEXDirection { return this._direction }
    public set direction(value: GradientTEXDirection) { this._direction = value; super.didEdit(); }
    
    _scale: number = 1.0
    public get scale(): number { return this._scale }
    public set scale(value: number) { this._scale = value; super.didEdit(); }
    
    _offset: number = 0.0
    public get offset(): number { return this._offset }
    public set offset(value: number) { this._offset = value; super.didEdit(); }
    
    _extend: GradientTEXExtend = GradientTEXExtend.mirror
    public get extend(): GradientTEXExtend { return this._extend }
    public set extend(value: GradientTEXExtend) { this._extend = value; super.didEdit(); }
    
    _colorStops: GradientTEXColorStop[] = [new GradientTEXColorStop(0.0, TEXColor.black), new GradientTEXColorStop(1.0, TEXColor.white)]
    public get colorStops(): GradientTEXColorStop[] { return this._colorStops }
    public set colorStops(value: GradientTEXColorStop[]) { this._colorStops = value; super.didEdit(); }
    
    // var colorStops: [ColorStop]
    
    constructor(resolution: TEXResolution) {
        
        super("content/generator/gradient/GradientTEX.glsl", resolution)

        this.uniformInts = function _(): Record<string, number> {
            let uniforms: Record<string, number> = {};
            uniforms["u_direction"] = this.direction;
            uniforms["u_extend"] = this.extend;
            uniforms["u_colorStopCount"] = this.colorStops.length;
            return uniforms
        }
        this.uniformFloats = function _(): Record<string, number> {
            let uniforms: Record<string, number> = {};
            uniforms["u_scale"] = this.scale;
            uniforms["u_offset"] = this.offset;
            return uniforms
        }
        this.uniformArrayOfFloats = function _(): Record<string, number[]> {
            let uniforms: Record<string, number[]> = {};
            uniforms["u_stops"] = this.colorStops.map(x => x.stop);
            return uniforms
        }
        this.uniformArrayOfColors = function _(): Record<string, TEXColor[]> {
            let uniforms: Record<string, TEXColor[]> = {};
            uniforms["u_colors"] = this.colorStops.map(x => x.color);
            return uniforms
        }
        super.didEdit()

    }

}

// module.exports = GradientTEX
