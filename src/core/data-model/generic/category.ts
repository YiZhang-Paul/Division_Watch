export class Category {
    public id: string | null = null;
    public name = '';
    public description = '';
    public icon = 'alert-circle';
    public color = 'rgb(30, 144, 255)';
    public isEditable = true;

    constructor(name = '') {
        this.name = name;
    }
}
