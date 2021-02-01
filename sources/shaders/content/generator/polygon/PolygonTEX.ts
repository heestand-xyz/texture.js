
class PolygonTEX extends TEXGenerator {

    _radius: number = 0.25
    public get radius(): number { return this._radius }
    public set radius(value: number) { this._radius = value; super.refresh(); }

    _rotation: number = 0.0
    public get rotation(): number { return this._rotation }
    public set rotation(value: number) { this._rotation = value; super.refresh(); }

    _vertexCount: number = 3
    public get vertexCount(): number { return this._vertexCount }
    public set vertexCount(value: number) { this._vertexCount = value; super.refresh(); }

    _cornerRadius: number = 0.0
    public get cornerRadius(): number { return this._cornerRadius }
    public set cornerRadius(value: number) { this._cornerRadius = value; super.refresh(); }
    
    // _antiAliased: boolean = true
    // public get antiAliased(): boolean { return this._antiAliased }
    // public set antiAliased(value: boolean) { this._antiAliased = value; super.refresh(); }
    
    constructor(resolution: TEXResolution) {
        
        super("content/generator/polygon/PolygonTEX.glsl", resolution)

        this.uniformFloats = function _(): Record<string, number> {
            let uniforms: Record<string, number> = {};
            uniforms["u_radius"] = this.radius;
            uniforms["u_rotation"] = this.rotation;
            uniforms["u_cornerRadius"] = this.cornerRadius;
            return uniforms
        }
        this.uniformInts = function _(): Record<string, number> {
            let uniforms: Record<string, number> = {};
            uniforms["u_vertexCount"] = this.vertexCount;
            return uniforms
        }
        // this.uniformBools = function _(): Record<string, boolean> {
        //     let uniforms: Record<string, boolean> = {};
        //     uniforms["u_antiAliased"] = this.antiAliased;
        //     return uniforms
        // }
        super.refresh()

    }

}

// module.exports = PolygonTEX
