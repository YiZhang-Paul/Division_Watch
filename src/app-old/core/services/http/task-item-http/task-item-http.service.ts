export class TaskItemHttpService {
    public async getTaskItem(id: string): Promise<TaskItem> {
        const endpoint = `${this._api}/${id}`;

        return (await axios.get(endpoint)).data;
    }
}
