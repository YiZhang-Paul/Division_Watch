export class ConfirmDialogOption {
    public title: string;
    public confirmText: string;
    public isWarning: boolean;

    constructor(title = 'Are you sure?', confirmText = 'Proceed', isWarning = false) {
        this.title = title;
        this.confirmText = confirmText;
        this.isWarning = isWarning;
    }
}
