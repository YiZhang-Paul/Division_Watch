import { ActionContext } from 'vuex';

import { TaskItem } from '../../core/data-model/task-item/task-item';
import { TaskItemOptions } from '../../core/data-model/task-item/task-item-options';
import { UpdateTaskResult } from '../../core/data-model/task-item/update-task-result';
import { TaskItemHttpService } from '../../core/services/http/task-item-http/task-item-http.service';
import { GenericUtility } from '../../core/utilities/generic/generic.utility';

const taskItemHttpService = new TaskItemHttpService();

export interface ITaskItemState {
    taskItemOptions: TaskItemOptions;
    incompleteItems: TaskItem[];
    activeItem: TaskItem | null;
}

function sortByPriority(tasks: TaskItem[]): TaskItem[] {
    return tasks.sort((a, b) => b.priority.rank - a.priority.rank);
}

const state = (): ITaskItemState => ({
    taskItemOptions: new TaskItemOptions(),
    incompleteItems: [],
    activeItem: null
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
    activeItem: (state: ITaskItemState): TaskItem | null => state.activeItem
};

const mutations = {
    setTaskItemOptions(state: ITaskItemState, taskItemOptions: TaskItemOptions): void {
        state.taskItemOptions = taskItemOptions;
    },
    setIncompleteItems(state: ITaskItemState, items: TaskItem[]): void {
        state.incompleteItems = items;
    },
    setIncompleteItem(state: ITaskItemState, taskItem: TaskItem): void {
        const tasks = state.incompleteItems;
        const index = tasks.findIndex(_ => _.id === taskItem.id);

        if (index !== -1) {
            state.incompleteItems = GenericUtility.replaceAt(tasks, taskItem, index);
        }
    },
    setActiveItem(state: ITaskItemState, taskItem: TaskItem | null): void {
        state.activeItem = taskItem;
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
    async updateTaskItem(context: ActionContext<ITaskItemState, any>, taskItem: TaskItem): Promise<UpdateTaskResult | null> {
        const result = await taskItemHttpService.updateTaskItem(taskItem);

        if (!result) {
            return null;
        }

        context.commit('setIncompleteItem', result.target);

        if (result.parent) {
            context.commit('setIncompleteItem', result.parent);
        }

        return result;
    },
    swapActiveItem(context: ActionContext<ITaskItemState, any>, taskItem: TaskItem): void {
        context.commit('setActiveItem', null);
        setTimeout(() => context.commit('setActiveItem', taskItem));
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
