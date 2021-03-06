<template>
    <div :class="{ 'inspect-mode': activeItem }">
        <item-inspector v-if="activeItem"
            class="item-inspector"
            :plan="plan"
            :item="activeItem"
            @register:planned="addToPlanned(activeItem)"
            @register:potential="addToPotential(activeItem)"
            @item:select="onItemSelectById($event)"
            @item:cancel="onItemSelect(null)">
        </item-inspector>

        <plan-viewer class="plan-viewer"
            :plan="plan"
            :goalOptions="goalOptions"
            :selectedItem="activeItem"
            :isDragDisabled="isDragDisabled"
            @plan:change="onPlanChange($event)"
            @item:select="onItemSelect($event)"
            @view:back="backToMain()"
            @view:close="closePanel()">
        </plan-viewer>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../store';
import { mainViewKey } from '../../store/main-view/main-view.state';
import { dailyPlanKey } from '../../store/daily-plan/daily-plan.state';
import { taskItemKey } from '../../store/task-item/task-item.state';
// eslint-disable-next-line no-unused-vars
import { Goal } from '../../core/data-model/generic/goal';
// eslint-disable-next-line no-unused-vars
import { GoalOptions } from '../../core/data-model/generic/goal-options';
// eslint-disable-next-line no-unused-vars
import { DailyPlan } from '../../core/data-model/generic/daily-plan';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
import { ViewOption } from '../../core/enums/view-option.enum';

import PlanViewer from './plan-viewer/PlanViewer.vue';
import ItemInspector from './ItemInspector.vue';

@Options({
    components: {
        PlanViewer,
        ItemInspector
    }
})
export default class DailyPlanner extends Vue {
    public isDragDisabled = false;
    private updateDebounceTimer: NodeJS.Timeout | null = null;

    get goalOptions(): GoalOptions {
        return store.getters[`${dailyPlanKey}/goalOptions`];
    }

    get plan(): DailyPlan | null {
        return store.getters[`${dailyPlanKey}/currentPlan`];
    }

    get activeItem(): TaskItem | null {
        return store.getters[`${dailyPlanKey}/activeItem`];
    }

    public async created(): Promise<void> {
        this.onItemSelect(null);

        await Promise.allSettled([
            store.dispatch(`${dailyPlanKey}/loadGoalOptions`),
            store.dispatch(`${dailyPlanKey}/loadCurrentPlan`)
        ]);

        if (this.plan) {
            const total = this.plan.goal.sessions * this.plan.goal.sessionDuration;
            const sessions = Math.round(total / this.goalOptions.sessionDuration);
            const adjusted = Math.min(sessions, this.goalOptions.sessions.max);
            const goal = { sessions: adjusted, sessionDuration: this.goalOptions.sessionDuration } as Goal;
            this.onPlanChange({ ...this.plan, goal });
        }
    }

    public beforeUnmount(): void {
        if (this.updateDebounceTimer) {
            store.dispatch(`${dailyPlanKey}/upsertDailyPlan`, this.plan);
        }
    }

    public backToMain(): void {
        store.commit(`${mainViewKey}/setActiveView`, ViewOption.MainMenuNoop);
    }

    public closePanel(): void {
        store.commit(`${mainViewKey}/setActiveView`, ViewOption.Inactive);
    }

    public onItemSelectById(id: string): void {
        this.onItemSelect(store.getters[`${taskItemKey}/incompleteItem`](id));
    }

    public onItemSelect(item: TaskItem | null): void {
        if (!item || item.id !== this.activeItem?.id) {
            store.commit(`${dailyPlanKey}/setActiveItem`, item);
        }
    }

    public addToPlanned(item: TaskItem): void {
        this.onPlanChange({ ...this.plan, planned: [...this.plan!.planned, item.id] } as DailyPlan);
        this.onItemSelect(null);
    }

    public addToPotential(item: TaskItem): void {
        this.onPlanChange({ ...this.plan, potential: [...this.plan!.potential, item.id] } as DailyPlan);
        this.onItemSelect(null);
    }

    public onPlanChange(plan: DailyPlan): void {
        store.commit(`${dailyPlanKey}/setCurrentPlan`, plan);

        if (this.updateDebounceTimer) {
            clearTimeout(this.updateDebounceTimer);
        }

        this.updateDebounceTimer = setTimeout(async() => {
            this.isDragDisabled = true;

            await Promise.allSettled([
                store.dispatch(`${dailyPlanKey}/upsertDailyPlan`, this.plan),
                store.dispatch(`${dailyPlanKey}/syncSessionTime`)
            ]);

            this.isDragDisabled = false;
            this.updateDebounceTimer = null;
        }, 400);
    }
}
</script>

<style lang="scss" scoped>
.plan-viewer {
    position: absolute;
    top: 0;
    right: 7.5%;
    width: 85%;
    height: 100%;
    transform: perspective(1000px) rotateY(0);
}

.inspect-mode {
    position: relative;
    overflow: hidden;

    .item-inspector {
        position: absolute;
        top: 12.5%;
        left: 1.75%;
        width: 25%;
        height: 75%;
    }

    .plan-viewer {
        animation: shiftPanel 0.1s ease forwards;
    }
}

@keyframes shiftPanel {
    0% {
        right: 7.5%;
        transform: perspective(8500px) rotateY(0);
    }
    100% {
        right: -5%;
        transform: perspective(8500px) rotateY(-35deg);
    }
}
</style>
