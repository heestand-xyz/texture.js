
class ImageTEX extends TEXResource {
    
    image: TexImageSource | null

    _imageResolution: TEXResolution | null = null
    public get imageResolution(): TEXResolution | null { return this._imageResolution }
    public set imageResolution(value: TEXResolution | null) { this._imageResolution = value; super.render(); }
    
    constructor(canvas: HTMLCanvasElement, image: TexImageSource | null) {
        
        super("content/resource/image/ImageTEX.glsl", canvas)

        this.image = image

        this.uniformResolutions = function _(): Record<string, TEXResolution> {
            let uniforms: Record<string, TEXResolution> = {};
            uniforms["u_imageResolution"] = this.imageResolution ?? new TEXResolution(1, 1);
            return uniforms
        }

        if (image != null) {
            this.loadImage(image!)
        }

    }

    public loadImage(image: TexImageSource) {
        this.imageResolution = new TEXResolution(image!.width, image!.height)
        this.resourceTexture = this.createTexture(image)
        super.render()
    }

}

// module.exports = ImageTEX;
