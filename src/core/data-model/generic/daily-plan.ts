import { Goal } from './goal';

export class DailyPlan {
    public date!: string;
    public goal = new Goal();
    public planned: string[] = [];
    public potential: string[] = [];

    constructor(date: Date) {
        this.date = date.toISOString();
    }
}
