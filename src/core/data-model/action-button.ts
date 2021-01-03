export class ActionButton {
    public name: string;
    public icon: any;
    public color: string;

    constructor(name = '', icon: any = null, color = '') {
        this.name = name;
        this.icon = icon;
        this.color = color;
    }
}
