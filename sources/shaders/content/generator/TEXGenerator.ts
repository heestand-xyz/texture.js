
class TEXGenerator extends TEXContent {

    _backgroundColor: TEXColor = new TEXColor(0.0, 0.0, 0.0, 1.0)
    public get backgroundColor(): TEXColor { return this._backgroundColor }
    public set backgroundColor(value: TEXColor) { this._backgroundColor = value; super.refresh(); }
    
    _color: TEXColor = new TEXColor(1.0, 1.0, 1.0, 1.0)
    public get color(): TEXColor { return this._color }
    public set color(value: TEXColor) { this._color = value; super.refresh(); }

    _position: TEXPosition = new TEXPosition(0.0, 0.0)
    public get position(): TEXPosition { return this._position }
    public set position(value: TEXPosition) { this._position = value; super.refresh(); }

    constructor(shaderName: string, resolution: TEXResolution) {

        super(shaderName)

        this.resolution = resolution

        this.uniformPositions = function _(): Record<string, TEXPosition> {
            let uniforms: Record<string, TEXPosition> = {};
            uniforms["u_position"] = this.position;
            return uniforms
        }
        this.uniformColors = function _(): Record<string, TEXColor> {
            let uniforms: Record<string, TEXColor> = {};
            uniforms["u_backgroundColor"] = this.backgroundColor;
            uniforms["u_color"] = this.color;
            return uniforms
        }
        super.refresh()

    }

}