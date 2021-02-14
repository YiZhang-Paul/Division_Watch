import { DropdownOption } from './dropdown-option';

export class DialogOption<T> {
    public title: string;
    public confirmText: string;
    public cancelText: string;
    public checkboxText: string;
    public dropdown: DropdownOption<T> | null = null;
    public isWarning: boolean;
    public confirmCallback: ((checked: any, selected: T) => void) | null = null;
    public cancelCallback: (() => void) | null = null;

    constructor(
        title = '',
        confirmText = '',
        cancelText = '',
        checkboxText = '',
        dropdown: DropdownOption<T> | null = null,
        isWarning = false
    ) {
        this.title = title;
        this.confirmText = confirmText;
        this.cancelText = cancelText;
        this.checkboxText = checkboxText;
        this.dropdown = dropdown;
        this.isWarning = isWarning;
    }
}
