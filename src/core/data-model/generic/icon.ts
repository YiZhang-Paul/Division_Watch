export class Icon {
    public icon: any;
    public isReserved: boolean;

    constructor(icon: any, isReserved = false) {
        this.icon = icon;
        this.isReserved = isReserved;
    }
}
