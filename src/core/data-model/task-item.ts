import { Category } from './category';

export class TaskItem {
    public name = '';
    public category: Category | null = null;
    public priority = 0;
    public estimate = 0;
    public deadline!: string;
    public recur: number[] = [];
    public subtasks: TaskItem[] = [];
    public isInterruption = false;
    public isCompleted = false;
}
