import { ActionContext } from 'vuex';

import { TaskItem } from '../../core/data-model/task-item';
import { TaskItemHttpService } from '../../core/services/http/task-item-http/task-item-http.service';

const taskItemHttpService = new TaskItemHttpService();

export interface ITaskItemState {
    taskItems: TaskItem[];
    activeTaskItem: TaskItem | null;
}

const state = (): ITaskItemState => ({
    taskItems: [],
    activeTaskItem: null
});

const getters = {
    activeTaskItem: (state: ITaskItemState): TaskItem | null => state.activeTaskItem,
    tasks: (state: ITaskItemState): TaskItem[] => state.taskItems.filter(_ => !_.isInterruption),
    interruptions: (state: ITaskItemState): TaskItem[] => state.taskItems.filter(_ => _.isInterruption)
};

const mutations = {
    setTaskItems(state: ITaskItemState, taskItems: TaskItem[]): void {
        state.taskItems = taskItems.slice();
    },
    setActiveTaskItem(state: ITaskItemState, taskItem: TaskItem | null): void {
        state.activeTaskItem = taskItem;
    }
};

const actions = {
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
