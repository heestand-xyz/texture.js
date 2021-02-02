
class NoiseTEX extends TEXGenerator {
    
    _octaves: number = 1.0
    public get octaves(): number { return this._octaves }
    public set octaves(value: number) { this._octaves = value; super.didEdit(); }

    _persistence: number = 0.5
    public get persistence(): number { return this._persistence }
    public set persistence(value: number) { this._persistence = value; super.didEdit(); }

    _scale: number = 1.0
    public get scale(): number { return this._scale }
    public set scale(value: number) { this._scale = value; super.didEdit(); }

    _zPosition: number = 0.0
    public get zPosition(): number { return this._zPosition }
    public set zPosition(value: number) { this._zPosition = value; super.didEdit(); }

    _colored: boolean = false
    public get colored(): boolean { return this._colored }
    public set colored(value: boolean) { this._colored = value; super.didEdit(); }

    constructor(resolution: TEXResolution) {
        
        super("content/generator/noise/NoiseTEX.glsl", resolution)

        this.uniformInts = function _(): Record<string, number> {
            let uniforms: Record<string, number> = {};
            uniforms["u_octaves"] = this.octaves;
            return uniforms
        }
        this.uniformFloats = function _(): Record<string, number> {
            let uniforms: Record<string, number> = {};
            uniforms["u_persistence"] = this.persistence;
            uniforms["u_scale"] = this.scale;
            uniforms["u_zPosition"] = this.zPosition;
            return uniforms
        }
        this.uniformBools = function _(): Record<string, boolean> {
            let uniforms: Record<string, boolean> = {};
            uniforms["u_colored"] = this.colored;
            return uniforms
        }
        super.didEdit()

    }

}

// module.exports = NoiseTEX