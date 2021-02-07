import { AddChildResult } from '../../../data-model/add-child-result';
import { DeleteTaskResult } from '../../../data-model/delete-task-result';

export class TaskItemHttpService {
    public async getTaskItem(id: string): Promise<TaskItem> {
        const endpoint = `${this._api}/${id}`;

        return (await axios.get(endpoint)).data;
    }

    public async getEmptyTaskItem(): Promise<TaskItem> {
        const endpoint = `${this._api}/empty`;

        return (await axios.get(endpoint)).data;
    }

    public async addTaskItem(item: TaskItem): Promise<TaskItem> {
        return (await axios.post(this._api, item)).data;
    }

    public async addChildTaskItem(parentId: string, item: TaskItem): Promise<AddChildResult> {
        const endpoint = `${this._api}/${parentId}/children`;

        return (await axios.post(endpoint, item)).data;
    }

    public async deleteTaskItem(id: string, keepChildren = true): Promise<DeleteTaskResult> {
        const endpoint = `${this._api}/${id}?keepChildren=${keepChildren}`;

        return (await axios.delete(endpoint)).data;
    }
}
