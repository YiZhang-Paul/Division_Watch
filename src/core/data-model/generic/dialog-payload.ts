export class DialogPayload<T> {
    public component: any;
    public data: T | null;
    public confirmHook: ((...args: any[]) => void) | null;

    constructor(component: any, data: T | null = null, confirmHook: ((...args: any[]) => void) | null = null) {
        this.component = component;
        this.data = data;
        this.confirmHook = confirmHook;
    }
}
