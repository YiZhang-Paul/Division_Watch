import axios from 'axios';

import { TaskItem } from '../../../data-model/task-item/task-item';
import { AddChildResult } from '../../../data-model/task-item/add-child-result';
import { UpdateTaskResult } from '../../../data-model/task-item/update-task-result';
import { DeleteTaskResult } from '../../../data-model/task-item/delete-task-result';
import { TaskItemOptions } from '../../../data-model/task-item/task-item-options';

export class TaskItemHttpService {
    private readonly _api = `${process.env.VUE_APP_BASE_API_URL}/task-item`;

    public async getIncompleteItems(limit = 0): Promise<TaskItem[]> {
        try {
            const endpoint = `${this._api}/incomplete?limit=${limit}`;

            return (await axios.get(endpoint)).data;
        }
        catch {
            return [];
        }
    }

    public async addChildTaskItem(parentId: string, item: TaskItem): Promise<AddChildResult | null> {
        try {
            const endpoint = `${this._api}/${parentId}/children`;

            return (await axios.post(endpoint, item)).data;
        }
        catch {
            return null;
        }
    }

    public async updateTaskItem(item: TaskItem): Promise<UpdateTaskResult | null> {
        try {
            return (await axios.put(this._api, item)).data;
        }
        catch {
            return null;
        }
    }

    public async deleteTaskItem(id: string, keepChildren = true): Promise<DeleteTaskResult | null> {
        try {
            const endpoint = `${this._api}/${id}?keepChildren=${keepChildren}`;

            return (await axios.delete(endpoint)).data;
        }
        catch {
            return null;
        }
    }

    public async getTaskItemOptions(date: string): Promise<TaskItemOptions> {
        try {
            const endpoint = `${this._api}/options`;
            const headers = { 'content-type': 'application/json' };

            return (await axios.post(endpoint, JSON.stringify(date), { headers })).data;
        }
        catch {
            return new TaskItemOptions();
        }
    }
}
