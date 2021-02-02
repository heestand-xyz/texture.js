
class ColorShiftTEX extends TEXSingleEffect {

    _hue: number = 0.0
    public get hue(): number { return this._hue }
    public set hue(value: number) { this._hue = value; super.didEdit(); }

    _saturation: number = 1.0
    public get saturation(): number { return this._saturation }
    public set saturation(value: number) { this._saturation = value; super.didEdit(); }

    _tintColor: TEXColor = new TEXColor(1.0, 1.0, 1.0, 1.0)
    public get tintColor(): TEXColor { return this._tintColor }
    public set tintColor(value: TEXColor) { this._tintColor = value; super.didEdit(); }

    constructor() {

        super("effects/single/colorShift/ColorShiftTEX.glsl")

        this.uniformFloats = function _(): Record<string, number> {
            let uniforms: Record<string, number> = {};
            uniforms["u_hue"] = this.hue;
            uniforms["u_saturation"] = this.saturation;
            return uniforms
        }
        this.uniformColors = function _(): Record<string, TEXColor> {
            let uniforms: Record<string, TEXColor> = {};
            uniforms["u_tintColor"] = this.tintColor;
            return uniforms
        }
        super.didEdit()

    }

}

// module.exports = ColorShiftTEX
