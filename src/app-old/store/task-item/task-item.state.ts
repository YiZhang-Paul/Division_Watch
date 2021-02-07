import { UpdateTaskResult } from '../../core/data-model/update-task-result';
import { DeleteTaskResult } from '../../core/data-model/delete-task-result';
import { GenericUtility } from '../../core/utilities/generic/generic.utility';

const getters = {
    incompleteTask: (state: ITaskItemState) => (id: string): TaskItem | null => {
        return state.incompleteTaskItems.find(_ => !_.isInterruption && _.id === id) ?? null;
    }
};

const mutations = {
    addIncompleteTaskItem(state: ITaskItemState, taskItem: TaskItem): void {
        state.incompleteTaskItems = [...state.incompleteTaskItems, taskItem];
    },
    setIncompleteTaskItem(state: ITaskItemState, taskItem: TaskItem): void {
        const tasks = state.incompleteTaskItems;
        const index = tasks.findIndex(_ => _.id === taskItem.id);

        if (index !== -1) {
            state.incompleteTaskItems = GenericUtility.replaceAt(tasks, taskItem, index);
        }
    },
    deleteIncompleteTaskItem(state: ITaskItemState, taskItem: TaskItem): void {
        state.incompleteTaskItems = state.incompleteTaskItems.filter(_ => _.id !== taskItem.id);
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
    async addChildTaskItem(context: ActionContext<ITaskItemState, any>, payload: { parentId: string, task: TaskItem }): Promise<void> {
        const { commit, getters } = context;
        const result = await taskItemHttpService.addChildTaskItem(payload.parentId, payload.task);

        if (!result) {
            return;
        }

        commit('addIncompleteTaskItem', result.child);
        commit('setIncompleteTaskItem', result.parent);

        if (getters['activeTaskItem']?.id === result.parent.id) {
            commit('setActiveTaskItem', result.parent);
        }
    },
    async updateTaskItem(context: ActionContext<ITaskItemState, any>, taskItem: TaskItem): Promise<UpdateTaskResult | null> {
        const result = await taskItemHttpService.updateTaskItem(taskItem);

        if (!result) {
            return null;
        }

        context.commit('setIncompleteTaskItem', result.target);

        if (result.parent) {
            context.commit('setIncompleteTaskItem', result.parent);
        }

        return result;
    },
    async deleteTaskItem(context: ActionContext<ITaskItemState, any>, payload: { taskItem: TaskItem, keepChildren: boolean | null }): Promise<DeleteTaskResult | null> {
        const { taskItem, keepChildren } = payload;
        const result = await taskItemHttpService.deleteTaskItem(taskItem.id!, Boolean(keepChildren));

        if (!result) {
            return null;
        }

        context.commit('deleteIncompleteTaskItem', taskItem);

        if (result.parent) {
            context.commit('setIncompleteTaskItem', result.parent);
        }

        for (const child of result.updatedChildren) {
            context.commit('setIncompleteTaskItem', child);
        }

        for (const child of result.deletedChildren) {
            context.commit('deleteIncompleteTaskItem', child);
        }

        return result;
    },
    async convertInterruption(context: ActionContext<ITaskItemState, any>, interruption: TaskItem): Promise<TaskItem | null> {
        const taskItem: TaskItem = { ...interruption, isInterruption: false };
        const result: UpdateTaskResult = await context.dispatch('updateTaskItem', taskItem);

        return result?.target ?? null;
    }
};
