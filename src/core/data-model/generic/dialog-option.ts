export class DialogOption {
    public title: string;
    public confirmText: string;
    public cancelText: string;
    public isWarning: boolean;
    public confirmCallback: (() => void) | null = null;
    public cancelCallback: (() => void) | null = null;

    constructor(title = '', confirmText = '', cancelText = '', isWarning = false) {
        this.title = title;
        this.confirmText = confirmText;
        this.cancelText = cancelText;
        this.isWarning = isWarning;
    }
}
