
class CircleTEX extends TEXGenerator {

    _radius: number = 0.25
    public get radius(): number { return this._radius }
    public set radius(value: number) { this._radius = value; super.didEdit(); }

    constructor(resolution: TEXResolution) {
        
        super("content/generator/circle/CircleTEX.glsl", resolution)

        this.uniformFloats = function _(): Record<string, number> {
            let uniforms: Record<string, number> = {};
            uniforms["u_radius"] = this.radius;
            return uniforms
        }
        super.didEdit()

    }

}

// module.exports = CircleTEX

