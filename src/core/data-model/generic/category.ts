export class Category {
    public id: string | null = null;
    public name = '';
    public description = '';
    public icon = '';
    public color = 'rgb(33, 109, 224)';
    public isEditable = true;

    constructor(name = '') {
        this.name = name;
    }
}
