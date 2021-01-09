import { Category } from './category';
import { RankItem } from './rank-item';

export class TaskItem {
    public name = '';
    public category: Category | null = null;
    public priority!: RankItem;
    public estimate = 0;
    public deadline!: string;
    public recur: number[] = [];
    public subtasks: TaskItem[] = [];
    public isInterruption = false;
    public isCompleted = false;
}
