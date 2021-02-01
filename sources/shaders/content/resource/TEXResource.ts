
class TEXResource extends TEX {
    
    resourceTexture?: WebGLTexture

    constructor(shaderName: string, canvas: HTMLCanvasElement) {
        
        super(shaderName, canvas)

        this.subRender = function _() {
            // Sampler
            const samplerLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_sampler');
            this.gl.uniform1i(samplerLocation, 0);
        }

    }

}
