export class DistributionGroup {
    public name: string;
    public total: number;
    public color: string;

    constructor(name = '', total = 0, color = 'rgb(255, 255, 255)') {
        this.name = name;
        this.total = total;
        this.color = color;
    }
}
