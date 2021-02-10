export class BasicAction<T> {
    public name: string;
    public action: T;
    public isWarning: boolean;

    constructor(name = '', action: T, isWarning = false) {
        this.name = name;
        this.action = action;
        this.isWarning = isWarning;
    }
}
