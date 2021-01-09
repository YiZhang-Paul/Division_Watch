import { ActionContext } from 'vuex';

import { TaskItem } from '../../core/data-model/task-item';
import { TaskItemOptions } from '../../core/data-model/task-item-options';
import { TaskItemOptionsQuery } from '../../core/data-model/task-item-options-query';
import { TaskItemHttpService } from '../../core/services/http/task-item-http/task-item-http.service';

const taskItemHttpService = new TaskItemHttpService();

export interface ITaskItemState {
    taskItemOptions: TaskItemOptions;
    taskItems: TaskItem[];
    activeTaskItem: TaskItem | null;
}

const state = (): ITaskItemState => ({
    taskItemOptions: new TaskItemOptions(),
    taskItems: [],
    activeTaskItem: null
});

const getters = {
    taskItemOptions: (state: ITaskItemState): TaskItemOptions => state.taskItemOptions,
    activeTaskItem: (state: ITaskItemState): TaskItem | null => state.activeTaskItem,
    tasks: (state: ITaskItemState): TaskItem[] => state.taskItems.filter(_ => !_.isInterruption),
    interruptions: (state: ITaskItemState): TaskItem[] => state.taskItems.filter(_ => _.isInterruption)
};

const mutations = {
    setTaskItemOptions(state: ITaskItemState, taskItemOptions: TaskItemOptions): void {
        state.taskItemOptions = taskItemOptions;
    },
    setTaskItems(state: ITaskItemState, taskItems: TaskItem[]): void {
        state.taskItems = taskItems.slice();
    },
    setActiveTaskItem(state: ITaskItemState, taskItem: TaskItem | null): void {
        state.activeTaskItem = taskItem;
    }
};

const actions = {
    async loadTaskItemOptions(context: ActionContext<ITaskItemState, any>, query: TaskItemOptionsQuery): Promise<void> {
        context.commit('setTaskItemOptions', await taskItemHttpService.getTaskItemOptions(query));
    },
    async loadTaskItems(context: ActionContext<ITaskItemState, any>): Promise<void> {
        context.commit('setTaskItems', await taskItemHttpService.getTaskItems());
    }
};

export const taskItem = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
