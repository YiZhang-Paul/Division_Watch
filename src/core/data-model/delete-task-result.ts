import { TaskItem } from './task-item';

export class DeleteTaskResult {
    public parent!: TaskItem;
    public updatedChildren: TaskItem[] = [];
    public deletedChildren: TaskItem[] = [];
}
