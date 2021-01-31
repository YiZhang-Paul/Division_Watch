import axios from 'axios';

import { TaskItem } from '../../../data-model/task-item/task-item';

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
}
