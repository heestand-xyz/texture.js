
class TEXSingleEffect extends TEXEffect {

    _input?: TEX
    public get input(): TEX | undefined { return this._input }
    public set input(tex: TEX | undefined) {
        if (this._input != undefined) {
            this.disconnect(this.input!)
        }
        if (tex != undefined) {
            this.connect(tex)
        }
        this._input = tex;
    }

    constructor(shaderName: string) {
        
        super(shaderName)
        
        this.subRender = function _(gl: WebGLRenderingContext, program: WebGLProgram) {

            // Sampler
            const samplerLocation = gl.getUniformLocation(program, 'u_sampler');
            gl.uniform1i(samplerLocation, 0);

        }

    }

    connect(tex: TEX) {
        tex.outputs.push(this)
        this.inputs = [tex]
        super.refreshInputs()
    }

    disconnect(tex: TEX) {
        for (let index = 0; index < tex.outputs.length; index++) {
            const output: TEX = tex.outputs[index];
            if (output == this) {
                tex.outputs.splice(index, 1);
                break;
            }
        }
        this.inputs = []
        super.refreshInputs();
    }

}
