const getters = {
    incompleteTask: (state: ITaskItemState) => (id: string): TaskItem | null => {
        return state.incompleteTaskItems.find(_ => !_.isInterruption && _.id === id) ?? null;
    }
};

const actions = {
    async getEmptyTaskItem(): Promise<TaskItem> {
        return await taskItemHttpService.getEmptyTaskItem();
    },
    async addParentTaskItem(context: ActionContext<ITaskItemState, any>, taskItem: TaskItem): Promise<TaskItem | null> {
        const added = await taskItemHttpService.addTaskItem(taskItem);

        if (added) {
            context.commit('addIncompleteTaskItem', added);
        }

        return added;
    },
    async convertInterruption(context: ActionContext<ITaskItemState, any>, interruption: TaskItem): Promise<TaskItem | null> {
        const taskItem: TaskItem = { ...interruption, isInterruption: false };
        const result: UpdateTaskResult = await context.dispatch('updateTaskItem', taskItem);

        return result?.target ?? null;
    }
};
