export class DialogPayload<T> {
    public component: any;
    public data: T | null;

    constructor(component: any, data: T | null = null) {
        this.component = component;
        this.data = data;
    }
}
