import { ActionContext } from 'vuex';

import { TaskItem } from '../../core/data-model/task-item';
import { TaskItemOptions } from '../../core/data-model/task-item-options';
import { TaskItemOptionsQuery } from '../../core/data-model/task-item-options-query';
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
    incompleteTasks: (state: ITaskItemState): TaskItem[] => {
        return state.incompleteTaskItems.filter(_ => !_.isInterruption);
    },
    incompleteTask: (state: ITaskItemState) => (id: string): TaskItem | null => {
        return state.incompleteTaskItems.find(_ => !_.isInterruption && _.id === id) ?? null;
    },
    incompleteChildTasks: (state: ITaskItemState) => (id: string): TaskItem[] => {
        return state.incompleteTaskItems.filter(_ => !_.isInterruption && _.parent === id);
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
        const index = state.incompleteTaskItems.findIndex(_ => _.id === taskItem.id);

        if (index !== -1) {
            state.incompleteTaskItems = [...state.incompleteTaskItems.slice(0, index), taskItem, ...state.incompleteTaskItems.slice(index + 1)];
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
    async loadTaskItemOptions(context: ActionContext<ITaskItemState, any>, query: TaskItemOptionsQuery): Promise<void> {
        context.commit('setTaskItemOptions', await taskItemHttpService.getTaskItemOptions(query));
    },
    async loadIncompleteTaskItems(context: ActionContext<ITaskItemState, any>): Promise<void> {
        context.commit('setIncompleteTaskItems', await taskItemHttpService.getIncompleteTaskItems());
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
    }
};

export const taskItem = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
