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

function sortByPriority(tasks: TaskItem[]): TaskItem[] {
    return tasks.sort((a, b) => b.priority.rank - a.priority.rank);
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
        return sortByPriority(state.incompleteItems.filter(_ => !_.isInterruption && !_.parent));
    },
    incompleteChildTasks: (state: ITaskItemState): TaskItem[] => {
        return sortByPriority(state.incompleteItems.filter(_ => !_.isInterruption && _.parent));
    },
    incompleteChildTasksByParentId: (_: ITaskItemState, getters: any) => (id: string): TaskItem[] => {
        const children: TaskItem[] = getters.incompleteChildTasks;

        return children.filter(_ => _.parent === id);
    },
    incompleteInterruptions: (state: ITaskItemState): TaskItem[] => {
        return sortByPriority(state.incompleteItems.filter(_ => _.isInterruption));
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
