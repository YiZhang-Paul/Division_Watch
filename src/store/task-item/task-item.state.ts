import { ActionContext } from 'vuex';

import { TaskItem } from '../../core/data-model/task-item/task-item';
import { TaskItemOptions } from '../../core/data-model/task-item/task-item-options';
import { UpdateTaskResult } from '../../core/data-model/task-item/update-task-result';
import { DeleteTaskResult } from '../../core/data-model/task-item/delete-task-result';
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
    incompleteItem: (state: ITaskItemState) => (id: string): TaskItem | null => {
        return id ? state.incompleteItems.find(_ => _.id === id) ?? null : null;
    },
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
    addIncompleteItem(state: ITaskItemState, item: TaskItem): void {
        state.incompleteItems = [...state.incompleteItems, item];
    },
    deleteIncompleteItem(state: ITaskItemState, item: TaskItem): void {
        state.incompleteItems = state.incompleteItems.filter(_ => _.id !== item.id);
    },
    setIncompleteItems(state: ITaskItemState, items: TaskItem[]): void {
        state.incompleteItems = items;
    },
    setIncompleteItem(state: ITaskItemState, item: TaskItem): void {
        const tasks = state.incompleteItems;
        const index = tasks.findIndex(_ => _.id === item.id);

        if (index !== -1) {
            state.incompleteItems = GenericUtility.replaceAt(tasks, item, index);
        }
    },
    setActiveItem(state: ITaskItemState, item: TaskItem | null): void {
        state.activeItem = item;
    },
    setTaskItemOptions(state: ITaskItemState, options: TaskItemOptions): void {
        state.taskItemOptions = options;
    }
};

const actions = {
    async loadTaskItemOptions(context: ActionContext<ITaskItemState, any>): Promise<void> {
        const date = new Date().toISOString().replace(/T.*/g, '');
        context.commit('setTaskItemOptions', await taskItemHttpService.getTaskItemOptions(date));
    },
    async loadIncompleteItems(context: ActionContext<ITaskItemState, any>, autoOpen = false): Promise<void> {
        const { commit, getters } = context;
        const items = await taskItemHttpService.getIncompleteItems();
        commit('setIncompleteItems', items);

        if (autoOpen && !getters.activeItem && getters.incompleteParentTasks[0]) {
            commit('setActiveItem', getters.incompleteParentTasks[0]);
        }
    },
    async getEmptyTaskItem(): Promise<TaskItem | null> {
        return await taskItemHttpService.getEmptyTaskItem();
    },
    async addParentTaskItem(context: ActionContext<ITaskItemState, any>, item: TaskItem): Promise<TaskItem | null> {
        const added = await taskItemHttpService.addTaskItem(item);

        if (added) {
            context.commit('addIncompleteItem', added);
        }

        return added;
    },
    async addChildTaskItem(context: ActionContext<ITaskItemState, any>, payload: { parentId: string, item: TaskItem }): Promise<void> {
        const { commit, getters } = context;
        const result = await taskItemHttpService.addChildTaskItem(payload.parentId, payload.item);

        if (!result) {
            return;
        }

        commit('addIncompleteItem', result.child);
        commit('setIncompleteItem', result.parent);

        if (getters.activeItem?.id === result.parent.id) {
            commit('setActiveItem', result.parent);
        }
    },
    async updateTaskItem(context: ActionContext<ITaskItemState, any>, item: TaskItem): Promise<UpdateTaskResult | null> {
        const result = await taskItemHttpService.updateTaskItem(item);

        if (!result) {
            return null;
        }

        context.commit('setIncompleteItem', result.target);
        context.commit('setActiveItem', result.target);

        if (result.parent) {
            context.commit('setIncompleteItem', result.parent);
        }

        return result;
    },
    async deleteTaskItem(context: ActionContext<ITaskItemState, any>, payload: { item: TaskItem, keepChildren: boolean | null }): Promise<DeleteTaskResult | null> {
        const { item, keepChildren } = payload;
        const { commit, getters, dispatch } = context;
        const result = await taskItemHttpService.deleteTaskItem(item.id!, Boolean(keepChildren));

        if (!result) {
            return null;
        }

        commit('deleteIncompleteItem', item);

        if (item.id === getters.activeItem?.id) {
            commit('setActiveItem', null);
        }

        if (result.parent) {
            commit('setIncompleteItem', result.parent);
            dispatch('swapActiveItem', result.parent);
        }

        for (const child of result.updatedChildren) {
            commit('setIncompleteItem', child);
        }

        for (const child of result.deletedChildren) {
            commit('deleteIncompleteItem', child);
        }

        return result;
    },
    swapActiveItem(context: ActionContext<ITaskItemState, any>, item: TaskItem): void {
        context.commit('setActiveItem', null);
        setTimeout(() => context.commit('setActiveItem', item));
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
