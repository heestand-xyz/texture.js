
class TEXResolution {
    
    width: number
    height: number

    static fullHD: TEXResolution = new TEXResolution(1920, 1080);
    static ultraHD: TEXResolution = new TEXResolution(3840, 2160);

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
    }

}

// module.exports = TEXResolution;
