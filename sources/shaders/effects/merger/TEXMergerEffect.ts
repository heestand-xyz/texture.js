
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
        tex.texOutputs.push(this)
        if (this.texInputs.length > 0) {
            this.texInputs.splice(index, 0, tex)
        } else {
            this.texInputs.push(tex)
        }
        super.didConnect()
    }

    disconnect(tex: TEX, index: number) {
        for (let index = 0; index < tex.texOutputs.length; index++) {
            const output: TEX = tex.texOutputs[index];
            if (output == this) {
                tex.texOutputs.splice(index, 1);
                break;
            }
        }
        if (this.texInputs.length > 1) {
            this.texInputs.splice(index, 1)
        } else {
            this.texInputs = []
        }
        super.didConnect();
    }

}
