import axios from 'axios';

import { TaskItem } from '../../../data-model/task-item';

export class TaskItemHttpService {
    private readonly _api = `${process.env.VUE_APP_BASE_API_URL}/task-item`;

    public async getTaskItems(limit = 0): Promise<TaskItem[]> {
        const endpoint = `${this._api}/all?limit=${limit}`;

        return (await axios.get(endpoint)).data;
    }

    public async getTaskItem(id: string): Promise<TaskItem> {
        const endpoint = `${this._api}/${id}`;

        return (await axios.get(endpoint)).data;
    }

    public async addTaskItem(item: TaskItem): Promise<string> {
        return (await axios.post(this._api, item)).data;
    }

    public async updateTaskItem(item: TaskItem): Promise<boolean> {
        return (await axios.put(this._api, item)).data;
    }

    public async deleteTaskItem(id: string): Promise<boolean> {
        const endpoint = `${this._api}/${id}`;

        return (await axios.delete(endpoint)).data;
    }
}
