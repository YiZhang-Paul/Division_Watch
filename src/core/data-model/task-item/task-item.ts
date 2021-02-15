import { RankItem } from './rank-item';
import { ChecklistItem } from './checklist-item';

export class TaskItem {
    public id: string | null = null;
    public name = '';
    public categoryId: string | null = null;
    public priority!: RankItem;
    public estimate = 0;
    public deadline!: string | null;
    public recur: boolean[] = [];
    public checklist: ChecklistItem[] = [];
    public parent: string | null = null;
    public isInterruption = false;
    public isCompleted = false;
}
