export class DialogOption {
    public title: string;
    public confirmText: string;
    public cancelText: string;
    public checkboxText: string;
    public isWarning: boolean;
    public confirmCallback: ((_: any) => void) | null = null;
    public cancelCallback: (() => void) | null = null;

    constructor(title = '', confirmText = '', cancelText = '', checkboxText = '', isWarning = false) {
        this.title = title;
        this.confirmText = confirmText;
        this.cancelText = cancelText;
        this.checkboxText = checkboxText;
        this.isWarning = isWarning;
    }
}
