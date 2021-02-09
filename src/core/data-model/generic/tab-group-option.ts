export class TabGroupOption {
    public name: string;
    public icon: any;
    public badgeValue = 0;

    constructor(name = '', icon: any = null, badgeValue = 0) {
        this.name = name;
        this.icon = icon;
        this.badgeValue = badgeValue;
    }
}
