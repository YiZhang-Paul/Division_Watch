import { ActionContext } from 'vuex';

import { Goal } from '../../core/data-model/generic/goal';
import { TaskItem } from '../../core/data-model/task-item/task-item';
import { DailyPlan } from '../../core/data-model/generic/daily-plan';
import { DailyPlanHttpService } from '../../core/services/http/daily-plan-http/daily-plan-http.service';

const dailyPlanHttpService = new DailyPlanHttpService();

export interface IDailyPlanState {
    goalOptions: Goal[];
    activeItem: TaskItem | null;
    currentPlan: DailyPlan | null;
}

const state = (): IDailyPlanState => ({
    goalOptions: [],
    activeItem: null,
    currentPlan: null
});

const getters = {
    goalOptions: (state: IDailyPlanState): Goal[] => state.goalOptions,
    activeItem: (state: IDailyPlanState): TaskItem | null => state.activeItem,
    currentPlan: (state: IDailyPlanState): DailyPlan | null => state.currentPlan
};

const mutations = {
    setGoalOptions(state: IDailyPlanState, options: Goal[]): void {
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
