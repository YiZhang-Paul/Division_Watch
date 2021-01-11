import axios from 'axios';

import { TaskItem } from '../../../data-model/task-item';
import { TaskItemOptions } from '../../../data-model/task-item-options';
import { TaskItemOptionsQuery } from '../../../data-model/task-item-options-query';

export class TaskItemHttpService {
    private readonly _api = `${process.env.VUE_APP_BASE_API_URL}/task-item`;

    public async getIncompleteTaskItems(limit = 0): Promise<TaskItem[]> {
        const endpoint = `${this._api}/incomplete?limit=${limit}`;

        return (await axios.get(endpoint)).data;
    }

    public async getTaskItem(id: string): Promise<TaskItem> {
        const endpoint = `${this._api}/${id}`;

        return (await axios.get(endpoint)).data;
    }

    public async addChildTaskItem(parentId: string, item: TaskItem): Promise<TaskItem> {
        const endpoint = `${this._api}/${parentId}/children`;

        return (await axios.post(endpoint, item)).data;
    }

    public async updateTaskItem(item: TaskItem): Promise<boolean> {
        return (await axios.put(this._api, item)).data;
    }

    public async deleteTaskItem(id: string): Promise<boolean> {
        const endpoint = `${this._api}/${id}`;

        return (await axios.delete(endpoint)).data;
    }

    public async getTaskItemOptions(query: TaskItemOptionsQuery): Promise<TaskItemOptions> {
        const endpoint = `${this._api}/options`;

        return (await axios.post(endpoint, query)).data;
    }
}
