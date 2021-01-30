export class ShadowOption {
    public color: string;
    public blur: number;
    public offsetX: number;
    public offsetY: number;

    constructor(color = 'rgba(0, 0, 0, 0)', blur = 0, offsetX = 0, offsetY = 0) {
        this.color = color;
        this.blur = blur;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
}
