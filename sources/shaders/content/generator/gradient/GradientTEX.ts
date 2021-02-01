
enum GradientDirection {
    horizontal = 0,
    vertical = 1,
    radial = 2,
    angle = 3,
}
// module.exports = GradientDirection

enum GradientExtend {
    zero = 0,
    hold = 1,
    loop = 2,
    mirror = 3,
}
// module.exports = GradientExtend

class GradientColorStop {
    stop: number;
    color: TEXColor;
    constructor(stop: number, color: TEXColor) {
        this.stop = stop
        this.color = color
    }
}
// module.exports = GradientColorStop

class GradientTEX extends TEXGenerator {

    _direction: GradientDirection = GradientDirection.vertical
    public get direction(): GradientDirection { return this._direction }
    public set direction(value: GradientDirection) { this._direction = value; super.refresh(); }
    
    _scale: number = 1.0
    public get scale(): number { return this._scale }
    public set scale(value: number) { this._scale = value; super.refresh(); }
    
    _offset: number = 0.0
    public get offset(): number { return this._offset }
    public set offset(value: number) { this._offset = value; super.refresh(); }
    
    _extend: GradientExtend = GradientExtend.mirror
    public get extend(): GradientExtend { return this._extend }
    public set extend(value: GradientExtend) { this._extend = value; super.refresh(); }
    
    _colorStops: GradientColorStop[] = [new GradientColorStop(0.0, TEXColor.black), new GradientColorStop(1.0, TEXColor.white)]
    public get colorStops(): GradientColorStop[] { return this._colorStops }
    public set colorStops(value: GradientColorStop[]) { this._colorStops = value; super.refresh(); }
    
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
        super.refresh()

    }

}

// module.exports = GradientTEX
