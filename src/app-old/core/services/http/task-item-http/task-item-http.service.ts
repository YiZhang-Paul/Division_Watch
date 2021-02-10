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
}
