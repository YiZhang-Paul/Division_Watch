export class TaskItem {
    public name = '';
    public priority = 0;
    public estimate = 0;
    public deadline!: Date;
    public recur: number[] = [];
    public subtasks: TaskItem[] = [];
    public isInterruption = false;
    public isCompleted = false;
}
