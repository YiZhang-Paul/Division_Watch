import { ActionContext } from 'vuex';

import { TaskItem } from '../../core/data-model/task-item/task-item';
import { TaskItemOptions } from '../../core/data-model/task-item/task-item-options';
import { TaskItemHttpService } from '../../core/services/http/task-item-http/task-item-http.service';

const taskItemHttpService = new TaskItemHttpService();

export interface ITaskItemState {
    taskItemOptions: TaskItemOptions;
    incompleteItems: TaskItem[];
    activeTaskItem: TaskItem | null;
}

const state = (): ITaskItemState => ({
    taskItemOptions: new TaskItemOptions(),
    incompleteItems: [],
    activeTaskItem: null
});

const getters = {
    taskItemOptions: (state: ITaskItemState): TaskItemOptions => state.taskItemOptions,
    incompleteItems: (state: ITaskItemState): TaskItem[] => state.incompleteItems,
    incompleteParentTasks: (state: ITaskItemState): TaskItem[] => {
        const parents = state.incompleteItems.filter(_ => !_.isInterruption && !_.parent);

        return parents.sort((a, b) => b.priority.rank - a.priority.rank);
    },
    incompleteChildTasks: (state: ITaskItemState): TaskItem[] => {
        const children = state.incompleteItems.filter(_ => !_.isInterruption && _.parent);

        return children.sort((a, b) => b.priority.rank - a.priority.rank);
    },
    incompleteInterruptions: (state: ITaskItemState): TaskItem[] => {
        const interruptions = state.incompleteItems.filter(_ => _.isInterruption);

        return interruptions.sort((a, b) => b.priority.rank - a.priority.rank);
    },
    activeTaskItem: (state: ITaskItemState): TaskItem | null => state.activeTaskItem
};

const mutations = {
    setTaskItemOptions(state: ITaskItemState, taskItemOptions: TaskItemOptions): void {
        state.taskItemOptions = taskItemOptions;
    },
    setIncompleteItems(state: ITaskItemState, items: TaskItem[]): void {
        state.incompleteItems = items;
    },
    setActiveTaskItem(state: ITaskItemState, taskItem: TaskItem | null): void {
        state.activeTaskItem = taskItem;
    }
};

const actions = {
    async loadTaskItemOptions(context: ActionContext<ITaskItemState, any>): Promise<void> {
        const date = new Date().toISOString().replace(/T.*/g, '');
        context.commit('setTaskItemOptions', await taskItemHttpService.getTaskItemOptions(date));
    },
    async loadIncompleteItems(context: ActionContext<ITaskItemState, any>): Promise<void> {
        context.commit('setIncompleteItems', await taskItemHttpService.getIncompleteItems());
    },
    swapActiveTaskItem(context: ActionContext<ITaskItemState, any>, taskItem: TaskItem): void {
        context.commit('setActiveTaskItem', null);
        setTimeout(() => context.commit('setActiveTaskItem', taskItem));
    }
};

export const taskItemKey = 'taskItem';

export const taskItem = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
