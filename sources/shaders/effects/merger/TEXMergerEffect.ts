
class TEXMergerEffect extends TEXEffect {

    _inputA?: TEX
    public get inputA(): TEX | undefined { return this._inputA }
    public set inputA(tex: TEX | undefined) {
        if (this._inputA != undefined) {
            this.disconnect(this.inputA!, 0)
        }
        if (tex != undefined) {
            this.connect(tex, 0)
        }
        this._inputA = tex;
    }

    _inputB?: TEX
    public get inputB(): TEX | undefined { return this._inputB }
    public set inputB(tex: TEX | undefined) {
        if (this._inputB != undefined) {
            this.disconnect(this.inputB!, 1)
        }
        if (tex != undefined) {
            this.connect(tex, 1)
        }
        this._inputB = tex;
    }


    constructor(shaderName: string) {
        
        super(shaderName)
        
        this.subRender = function _(gl: WebGLRenderingContext, program: WebGLProgram) {

            // Sampler
            const samplerLocationA = gl.getUniformLocation(program, 'u_samplerA');
            const samplerLocationB = gl.getUniformLocation(program, 'u_samplerB');
            gl.uniform1i(samplerLocationA, 0);
            gl.uniform1i(samplerLocationB, 1);

        }

    }

    connect(tex: TEX, index: number) {
        tex.outputs.push(this)
        if (this.inputs.length > 0) {
            this.inputs.splice(index, 0, tex)
        } else {
            this.inputs.push(tex)
        }
        super.refreshInputs()
    }

    disconnect(tex: TEX, index: number) {
        for (let index = 0; index < tex.outputs.length; index++) {
            const output: TEX = tex.outputs[index];
            if (output == this) {
                tex.outputs.splice(index, 1);
                break;
            }
        }
        if (this.inputs.length > 1) {
            this.inputs.splice(index, 1)
        } else {
            this.inputs = []
        }
        super.refreshInputs();
    }

}
