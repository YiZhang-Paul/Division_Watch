export class DistributionGroup {
    public name: string;
    public total: number;
    public color: string;
    public highlight: boolean;

    constructor(name = '', total = 0, color = 'rgb(255, 255, 255)', highlight = true) {
        this.name = name;
        this.total = total;
        this.color = color;
        this.highlight = highlight;
    }
}
