export class ChecklistItem {
    public description: string;
    public isCompleted = false;

    constructor(description = '') {
        this.description = description;
    }
}
