
class ImageTEX extends TEXResource {
    
    image?: TexImageSource

    _imageResolution: TEXResolution | null = null
    public get imageResolution(): TEXResolution | null { return this._imageResolution }
    public set imageResolution(value: TEXResolution | null) { this._imageResolution = value; super.refresh(); }
    
    constructor() {
        
        super("content/resource/image/ImageTEX.glsl")

        this.uniformResolutions = function _(): Record<string, TEXResolution> {
            let uniforms: Record<string, TEXResolution> = {};
            uniforms["u_imageResolution"] = this.imageResolution ?? new TEXResolution(1, 1);
            return uniforms
        }

    }

    public loadImageURL(url: string) {
        let image = new Image();
        image.src = url;
        let self = this;
        image.onload = function() {
            self.loadImage(image);
        }
    }

    public loadImage(image: TexImageSource) {
        this.imageResolution = new TEXResolution(image!.width, image!.height)
        // this.resourceTexture = this.createTextureFromImage(image)
        super.refresh()
    }

    createTextureFromImage(gl: WebGLRenderingContext, image: TexImageSource): WebGLTexture {

        const texture = gl.createTexture()!;

        gl.bindTexture(gl.TEXTURE_2D, texture);

        const level = 0;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;
        gl.texImage2D(gl.TEXTURE_2D, level, format, format, type, image);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        return texture

    }

}

// module.exports = ImageTEX;
