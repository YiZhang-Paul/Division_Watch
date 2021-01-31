import { ActionContext } from 'vuex';

import { TaskItem } from '../../core/data-model/task-item/task-item';
import { TaskItemHttpService } from '../../core/services/http/task-item-http/task-item-http.service';

const taskItemHttpService = new TaskItemHttpService();

export interface ITaskItemState {
    incompleteItems: TaskItem[];
}

const state = (): ITaskItemState => ({
    incompleteItems: []
});

const getters = {
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
    }
};

const mutations = {
    setIncompleteItems(state: ITaskItemState, items: TaskItem[]): void {
        state.incompleteItems = items;
    }
};

const actions = {
    async loadIncompleteItems(context: ActionContext<ITaskItemState, any>): Promise<void> {
        context.commit('setIncompleteItems', await taskItemHttpService.getIncompleteItems());
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
