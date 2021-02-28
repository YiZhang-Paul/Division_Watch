type Transform<T> = ((_: T) => string) | null;

export class DropdownOption<T> {
    public text: string;
    public options: T[];
    public selected: T | null;
    public transform: Transform<T>;

    constructor(text = '', options: T[] = [], selected: T | null = null, transform: Transform<T> = null) {
        this.text = text;
        this.options = options;
        this.selected = selected;
        this.transform = transform;
    }
}
