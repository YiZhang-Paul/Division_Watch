import { ActionContext } from 'vuex';

import { TaskItem } from '../../core/data-model/task-item';
import { TaskItemOptions } from '../../core/data-model/task-item-options';
import { GenericUtility } from '../../core/utilities/generic/generic.utility';
import { TaskItemHttpService } from '../../core/services/http/task-item-http/task-item-http.service';

const taskItemHttpService = new TaskItemHttpService();

export interface ITaskItemState {
    taskItemOptions: TaskItemOptions;
    incompleteTaskItems: TaskItem[];
    activeTaskItem: TaskItem | null;
}

const state = (): ITaskItemState => ({
    taskItemOptions: new TaskItemOptions(),
    incompleteTaskItems: [],
    activeTaskItem: null
});

const getters = {
    taskItemOptions: (state: ITaskItemState): TaskItemOptions => state.taskItemOptions,
    incompleteTask: (state: ITaskItemState) => (id: string): TaskItem | null => {
        return state.incompleteTaskItems.find(_ => !_.isInterruption && _.id === id) ?? null;
    },
    incompleteParentTasks: (state: ITaskItemState): TaskItem[] => {
        const parents = state.incompleteTaskItems.filter(_ => !_.isInterruption && !_.parent);

        return parents.sort((a, b) => b.priority.rank - a.priority.rank);
    },
    incompleteChildTasks: (state: ITaskItemState) => (id: string): TaskItem[] => {
        return state.incompleteTaskItems.filter(_ => !_.isInterruption && _.parent && _.parent === id);
    },
    incompleteInterruptions: (state: ITaskItemState): TaskItem[] => {
        return state.incompleteTaskItems.filter(_ => _.isInterruption);
    },
    activeTaskItem: (state: ITaskItemState): TaskItem | null => state.activeTaskItem
};

const mutations = {
    setTaskItemOptions(state: ITaskItemState, taskItemOptions: TaskItemOptions): void {
        state.taskItemOptions = taskItemOptions;
    },
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
    setIncompleteTaskItems(state: ITaskItemState, taskItems: TaskItem[]): void {
        state.incompleteTaskItems = taskItems.slice();
    },
    setActiveTaskItem(state: ITaskItemState, taskItem: TaskItem | null): void {
        state.activeTaskItem = taskItem;
    }
};

const actions = {
    async loadTaskItemOptions(context: ActionContext<ITaskItemState, any>, date: string): Promise<void> {
        context.commit('setTaskItemOptions', await taskItemHttpService.getTaskItemOptions(date));
    },
    async loadIncompleteTaskItems(context: ActionContext<ITaskItemState, any>): Promise<void> {
        context.commit('setIncompleteTaskItems', await taskItemHttpService.getIncompleteTaskItems());
    },
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
    async updateTaskItem(context: ActionContext<ITaskItemState, any>, taskItem: TaskItem): Promise<void> {
        if (await taskItemHttpService.updateTaskItem(taskItem)) {
            context.commit('setIncompleteTaskItem', taskItem);
        }
    },
    swapActiveTaskItem(context: ActionContext<ITaskItemState, any>, taskItem: TaskItem): void {
        context.commit('setActiveTaskItem', null);
        setTimeout(() => context.commit('setActiveTaskItem', taskItem));
    }
};

export const taskItem = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
