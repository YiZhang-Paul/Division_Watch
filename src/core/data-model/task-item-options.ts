import { RankItem } from './rank-item';

export class TaskItemOptions {
    public priorities: RankItem[] = [];
    public deadlines: string[] = [];
    public estimates: number[] = [];
    public skullDuration = 0;
}
