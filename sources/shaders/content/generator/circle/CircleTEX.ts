
class CircleTEX extends TEXGenerator {

    _radius: number = 0.25
    public get radius(): number { return this._radius }
    public set radius(value: number) { this._radius = value; super.render(); }

    constructor(canvas: HTMLCanvasElement) {
        
        super("content/generator/circle/CircleTEX.glsl", canvas)

        this.uniformFloats = function _(): Record<string, number> {
            let uniforms: Record<string, number> = {};
            uniforms["u_radius"] = this.radius;
            return uniforms
        }
        super.render()

    }

}

// module.exports = CircleTEX

