import { TaskItem } from './task-item';

export class UpdateTasksResult {
    public parents: TaskItem[] = [];
    public targets: TaskItem[] = [];
}
