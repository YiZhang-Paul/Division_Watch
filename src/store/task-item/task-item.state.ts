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
    activeInterruption: TaskItem | null;
}

function sortByPriority(tasks: TaskItem[]): TaskItem[] {
    return tasks.sort((a, b) => {
        const bothInterruption = a.isInterruption && b.isInterruption;
        const neitherInterruption = !a.isInterruption && !b.isInterruption;

        if (a.priority.rank !== b.priority.rank || bothInterruption || neitherInterruption) {
            return b.priority.rank - a.priority.rank;
        }

        return a.isInterruption ? -1 : 1;
    });
}

const state = (): ITaskItemState => ({
    taskItemOptions: new TaskItemOptions(),
    incompleteItems: [],
    activeItem: null,
    activeInterruption: null
});

const getters = {
    taskItemOptions: (state: ITaskItemState): TaskItemOptions => state.taskItemOptions,
    incompleteItem: (state: ITaskItemState) => (id: string): TaskItem | null => {
        return id ? state.incompleteItems.find(_ => _.id === id) ?? null : null;
    },
    incompleteItems: (state: ITaskItemState): TaskItem[] => state.incompleteItems,
    incompleteItemsByIds: (state: ITaskItemState) => (ids: string[]): TaskItem[] => {
        const lookup = new Map(state.incompleteItems.map(_ => [_.id, _]));

        return ids.map(_ => lookup.get(_)!).filter(Boolean);
    },
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
    incompleteInterruptionsAndParentTasks: (_: ITaskItemState, getters: any): TaskItem[] => {
        return sortByPriority([...getters.incompleteParentTasks, ...getters.incompleteInterruptions]);
    },
    totalEstimation: (_: ITaskItemState, getters: any): number => {
        const items: TaskItem[] = getters.incompleteInterruptionsAndParentTasks;
        const options: TaskItemOptions = getters.taskItemOptions;

        return items.reduce((total, _) => total + _.estimate, 0) / (options.skullDuration || 1);
    },
    totalNearDue: (state: ITaskItemState): number => {
        const now = Date.now();
        const oneDay = 1000 * 60 * 60 * 24;
        const dates = state.incompleteItems.filter(_ => _.deadline).map(_ => new Date(_.deadline!));

        return dates.filter(_ => _.getTime() >= now && _.getTime() - now < oneDay * 2).length;
    },
    totalPastDue: (state: ITaskItemState): number => {
        const now = Date.now();
        const tasks = state.incompleteItems.filter(_ => _.deadline);

        return tasks.filter(_ => new Date(_.deadline!).getTime() < now).length;
    },
    activeItem: (state: ITaskItemState): TaskItem | null => state.activeItem,
    activeInterruption: (state: ITaskItemState): TaskItem | null => state.activeInterruption
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
    setActiveInterruption(state: ITaskItemState, item: TaskItem | null): void {
        state.activeInterruption = item;
    },
    setTaskItemOptions(state: ITaskItemState, options: TaskItemOptions): void {
        state.taskItemOptions = options;
    }
};

const actions = {
    async loadTaskItemOptions(context: ActionContext<ITaskItemState, any>): Promise<void> {
        context.commit('setTaskItemOptions', await taskItemHttpService.getTaskItemOptions());
    },
    async loadIncompleteItems(context: ActionContext<ITaskItemState, any>, autoOpen = false): Promise<void> {
        const { commit, getters } = context;
        const items = await taskItemHttpService.getIncompleteItems();
        commit('setIncompleteItems', items);

        if (!autoOpen) {
            return;
        }

        if (!getters.activeItem && getters.incompleteParentTasks[0]) {
            commit('setActiveItem', getters.incompleteParentTasks[0]);
        }

        if (!getters.activeInterruption && getters.incompleteInterruptions[0]) {
            commit('setActiveInterruption', getters.incompleteInterruptions[0]);
        }
    },
    async getEmptyTaskItem(_: ActionContext<ITaskItemState, any>, isInterruption: boolean): Promise<TaskItem | null> {
        return await taskItemHttpService.getEmptyTaskItem(isInterruption);
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
        context.commit(result.target.isInterruption ? 'setActiveInterruption' : 'setActiveItem', result.target);

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

        if (item.id === getters.activeInterruption?.id) {
            commit('setActiveInterruption', null);
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
    async convertChildTask(context: ActionContext<ITaskItemState, any>, item: TaskItem): Promise<TaskItem | null> {
        const { commit, getters } = context;
        const result = await taskItemHttpService.convertToParent(item);

        if (!result) {
            return null;
        }

        commit('setIncompleteItem', result);

        if (getters.activeItem?.id === result.id) {
            commit('setActiveItem', result);
        }

        return result;
    },
    async convertInterruption(context: ActionContext<ITaskItemState, any>, item: TaskItem): Promise<TaskItem | null> {
        const { commit, getters } = context;
        const result = await taskItemHttpService.convertToTask(item);

        if (!result) {
            return null;
        }

        commit('setIncompleteItem', result);

        if (getters.activeInterruption?.id === result.id) {
            commit('setActiveInterruption', null);
        }

        return result;
    },
    swapActiveItem(context: ActionContext<ITaskItemState, any>, item: TaskItem): void {
        context.commit('setActiveItem', null);
        setTimeout(() => context.commit('setActiveItem', item));
    },
    swapActiveInterruption(context: ActionContext<ITaskItemState, any>, item: TaskItem): void {
        context.commit('setActiveInterruption', null);
        setTimeout(() => context.commit('setActiveInterruption', item));
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
