
class TEXResource extends TEXContent {

    resourceTexture?: WebGLTexture

    constructor(shaderName: string) {
        
        super(shaderName)

        this.subRender = function _(gl: WebGLRenderingContext, program: WebGLProgram) {
            // Sampler
            const samplerLocation = gl.getUniformLocation(program, 'u_sampler');
            gl.uniform1i(samplerLocation, 0);
        }

    }

}
