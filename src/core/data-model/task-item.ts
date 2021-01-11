import { Category } from './category';
import { RankItem } from './rank-item';

export class TaskItem {
    public id: string | null = null;
    public name = '';
    public category: Category | null = null;
    public priority!: RankItem;
    public estimate = 0;
    public deadline!: string;
    public recur: number[] = [];
    public parent: string | null = null;
    public isInterruption = false;
    public isCompleted = false;
}
