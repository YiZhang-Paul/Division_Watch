export class RingOption {
    public fill: string;
    public margin: number;
    public thickness: number;
    public gap: number;

    constructor(fill = 'rgb(255, 255, 255)', margin = 0, thickness = 0, gap = 0) {
        this.fill = fill;
        this.margin = margin;
        this.thickness = thickness;
        this.gap = gap;
    }
}
