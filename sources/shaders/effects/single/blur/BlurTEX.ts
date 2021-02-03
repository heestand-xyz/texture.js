
enum BlurTEXStyle {
    // gaussian = 0,
    box = 1,
    angle = 2,
    zoom = 3,
    // random = 4,
}
// module.exports = BlurTEXStyle

class BlurTEX extends TEXSingleEffect {

    _style: BlurTEXStyle = BlurTEXStyle.box
    public get style(): BlurTEXStyle { return this._style }
    public set style(value: BlurTEXStyle) { this._style = value; super.didEdit(); }

    _radius: number = 0.1
    public get radius(): number { return this._radius }
    public set radius(value: number) { this._radius = value; super.didEdit(); }

    _quality: number = 20
    public get quality(): number { return this._quality }
    public set quality(value: number) { this._quality = value; super.didEdit(); }

    _angle: number = 0.0
    public get angle(): number { return this._angle }
    public set angle(value: number) { this._angle = value; super.didEdit(); }

    _position: TEXPosition = TEXPosition.zero
    public get position(): TEXPosition { return this._position }
    public set position(value: TEXPosition) { this._position = value; super.didEdit(); }

    constructor() {

        super("effects/single/blur/BlurTEX.glsl")

        this.uniformInts = function _(): Record<string, number> {
            let uniforms: Record<string, number> = {};
            uniforms["u_style"] = this.style;
            uniforms["u_quality"] = this.quality;
            return uniforms
        }
        this.uniformFloats = function _(): Record<string, number> {
            let uniforms: Record<string, number> = {};
            uniforms["u_radius"] = this.radius;
            uniforms["u_angle"] = this.angle;
            return uniforms
        }
        this.uniformPositions = function _(): Record<string, TEXPosition> {
            let uniforms: Record<string, TEXPosition> = {};
            uniforms["u_position"] = this.position;
            return uniforms
        }
        super.didEdit()

    }

}

// module.exports = BlurTEX
