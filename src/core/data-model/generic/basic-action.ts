export class BasicAction {
    public name: string;
    public isWarning: boolean;

    constructor(name = '', isWarning = false) {
        this.name = name;
        this.isWarning = isWarning;
    }
}
