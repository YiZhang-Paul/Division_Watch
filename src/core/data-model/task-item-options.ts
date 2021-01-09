import { Category } from './category';
import { RankItem } from './rank-item';

export class TaskItemOptions {
    public categories: Category[] = [];
    public priorities: RankItem[] = [];
    public deadlines: string[] = [];
    public estimates: number[] = [];
}
