export class DialogOption {
    public title: string;
    public confirmText: string;
    public cancelText: string;
    public isWarning: boolean;

    constructor(title = '', confirmText = '', cancelText = '', isWarning = false) {
        this.title = title;
        this.confirmText = confirmText;
        this.cancelText = cancelText;
        this.isWarning = isWarning;
    }
}
