const getters = {
    incompleteTask: (state: ITaskItemState) => (id: string): TaskItem | null => {
        return state.incompleteTaskItems.find(_ => !_.isInterruption && _.id === id) ?? null;
    }
};

const actions = {
    async convertInterruption(context: ActionContext<ITaskItemState, any>, interruption: TaskItem): Promise<TaskItem | null> {
        const taskItem: TaskItem = { ...interruption, isInterruption: false };
        const result: UpdateTaskResult = await context.dispatch('updateTaskItem', taskItem);

        return result?.target ?? null;
    }
};
