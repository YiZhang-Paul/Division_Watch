import { ActionContext } from 'vuex';

import { taskItemKey } from '../task-item/task-item.state';
import { TaskItem } from '../../core/data-model/task-item/task-item';
import { GoalOptions } from '../../core/data-model/generic/goal-options';
import { DailyPlan } from '../../core/data-model/generic/daily-plan';
import { DailyPlanHttpService } from '../../core/services/http/daily-plan-http/daily-plan-http.service';

const dailyPlanHttpService = new DailyPlanHttpService();

export interface IDailyPlanState {
    goalOptions: GoalOptions;
    activeItem: TaskItem | null;
    currentPlan: DailyPlan | null;
}

const state = (): IDailyPlanState => ({
    goalOptions: new GoalOptions(),
    activeItem: null,
    currentPlan: null
});

const getters = {
    goalOptions: (state: IDailyPlanState): GoalOptions => state.goalOptions,
    activeItem: (state: IDailyPlanState): TaskItem | null => state.activeItem,
    currentPlan: (state: IDailyPlanState): DailyPlan | null => state.currentPlan,
    plannedItems: (state: IDailyPlanState, _getters: any, _rootState: any, rootGetters: any): TaskItem[] => {
        const ids = state.currentPlan?.planned ?? [];

        return ids.length ? rootGetters[`${taskItemKey}/incompleteItemsByIds`](ids) : [];
    },
    potentialItems: (state: IDailyPlanState, _getters: any, _rootState: any, rootGetters: any): TaskItem[] => {
        const ids = state.currentPlan?.potential ?? [];

        return ids.length ? rootGetters[`${taskItemKey}/incompleteItemsByIds`](ids) : [];
    },
    currentEstimation: (_: IDailyPlanState, getters: any): number => {
        const items = [...getters.plannedItems, ...getters.potentialItems] as TaskItem[];

        return items.reduce((total, _) => total + _.estimate, 0);
    },
    candidates: (_: IDailyPlanState, _getters: any, _rootState: any, rootGetters: any) => (payload: { showTask: boolean; showInterruption: boolean }): TaskItem[] => {
        const { showTask, showInterruption } = payload;

        if (!showTask && !showInterruption) {
            return [];
        }

        if (showTask && showInterruption) {
            return rootGetters[`${taskItemKey}/incompleteInterruptionsAndParentTasks`];
        }
        else if (showTask) {
            return rootGetters[`${taskItemKey}/incompleteParentTasks`];
        }

        return rootGetters[`${taskItemKey}/incompleteInterruptions`];
    }
};

const mutations = {
    setGoalOptions(state: IDailyPlanState, options: GoalOptions): void {
        state.goalOptions = options;
    },
    setActiveItem(state: IDailyPlanState, item: TaskItem | null): void {
        state.activeItem = item;
    },
    setCurrentPlan(state: IDailyPlanState, plan: DailyPlan | null): void {
        state.currentPlan = plan;
    }
};

const actions = {
    async loadGoalOptions(context: ActionContext<IDailyPlanState, any>): Promise<void> {
        context.commit('setGoalOptions', await dailyPlanHttpService.getGoalOptions());
    },
    async loadCurrentPlan(context: ActionContext<IDailyPlanState, any>): Promise<void> {
        context.commit('setCurrentPlan', await dailyPlanHttpService.getDailyPlan(new Date()));
    },
    async upsertDailyPlan(context: ActionContext<IDailyPlanState, any>, plan: DailyPlan): Promise<void> {
        const updated = await dailyPlanHttpService.upsertDailyPlan(plan);

        if (updated) {
            context.commit('setCurrentPlan', updated);
        }
    },
    swapActiveItem(context: ActionContext<IDailyPlanState, any>, item: TaskItem): void {
        context.commit('setActiveItem', null);
        setTimeout(() => context.commit('setActiveItem', item));
    }
};

export const dailyPlanKey = 'dailyPlan';

export const dailyPlan = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
