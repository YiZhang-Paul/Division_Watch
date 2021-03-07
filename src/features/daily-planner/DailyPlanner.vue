<template>
    <div :class="{ 'inspect-mode': isInspectorOn, 'planner-mode': !isInspectorOn }">
        <item-inspector v-if="isInspectorOn"
            class="item-inspector"
            :plan="plan"
            :item="activeItem"
            @register:planned="register(activeItem)"
            @register:potential="register(activeItem, false)"
            @item:select="onItemSelectById($event)"
            @item:cancel="onItemSelect(null)">
        </item-inspector>

        <plan-viewer class="plan-viewer"
            :class="{ 'restoring-viewer': isClosingInspector }"
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
import { markRaw } from 'vue';

import store from '../../store';
import { mainViewKey } from '../../store/main-view/main-view.state';
import { dialogKey } from '../../store/dialog/dialog.state';
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
import { DialogPayload } from '../../core/data-model/generic/dialog-payload';
import { ViewOption } from '../../core/enums/view-option.enum';

import PlanViewer from './plan-viewer/PlanViewer.vue';
import ItemInspector from './item-inspector/ItemInspector.vue';
import RegisterParentDialog from './RegisterParentDialog.vue';

@Options({
    components: {
        PlanViewer,
        ItemInspector
    }
})
export default class DailyPlanner extends Vue {
    public isInspectorOn = false;
    public isClosingInspector = false;
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

    get candidates(): TaskItem[] {
        const payload = { showTask: true, showInterruption: true };

        return store.getters[`${dailyPlanKey}/unselectedCandidates`](payload);
    }

    public async created(): Promise<void> {
        store.commit(`${dailyPlanKey}/setActiveItem`, null);

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
        if (!item) {
            this.isClosingInspector = true;
            setTimeout(() => this.isClosingInspector = false, 300);
        }

        if (!item || item.id !== this.activeItem?.id) {
            store.dispatch(`${dailyPlanKey}/swapActiveItem`, item);
        }

        this.isInspectorOn = Boolean(item);
    }

    public register(item: TaskItem, isPlanned = true): void {
        const children = store.getters[`${dailyPlanKey}/unselectedChildTasks`](item.id) as TaskItem[];

        if (!children.length) {
            this.completeRegister(item, [item.id ?? ''], isPlanned);

            return;
        }

        const confirmHook = () => this.completeRegister(item, children.map(_ => _.id ?? ''), isPlanned);
        const payload = new DialogPayload(markRaw(RegisterParentDialog), children, confirmHook);
        store.dispatch(`${dialogKey}/open`, payload);
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

    private completeRegister(source: TaskItem, targets: string[], isPlanned: boolean): void {
        if (!source.parent) {
            this.selectPreviousItem(source);
        }

        if (isPlanned) {
            this.onPlanChange({ ...this.plan, planned: [...this.plan!.planned, ...targets] } as DailyPlan);
        }
        else {
            this.onPlanChange({ ...this.plan, potential: [...this.plan!.potential, ...targets] } as DailyPlan);
        }

        if (source.parent) {
            this.onItemSelect(this.candidates.find(_ => _.id === source.parent) ?? null);
        }
    }

    private selectPreviousItem(item: TaskItem): void {
        const index = this.candidates.findIndex(_ => _.id === item.id);
        const others = this.candidates.filter(_ => _.id !== item.id);

        if (index === -1 || !others.length) {
            this.onItemSelect(null);
        }
        else {
            this.onItemSelect(others[Math.min(index, others.length - 1)]);
        }
    }
}
</script>

<style lang="scss" scoped>
.plan-viewer {
    position: absolute;
    top: 0;
    right: 7.5%;
    width: 75%;
    height: 100%;
    transform: perspective(1000px) rotateY(0);
}

.inspect-mode {
    position: relative;
    overflow: hidden;

    .item-inspector {
        position: absolute;
        top: 12.5%;
        left: 1.25%;
        width: 22.5%;
        height: 75%;
    }

    .plan-viewer {
        animation: shiftPanel 0.2s ease forwards;
    }
}

.planner-mode .plan-viewer.restoring-viewer {
    right: 1.5%;
    transform: perspective(3000px) rotateY(-10deg);
    animation: shiftBackPanel 0.25s ease forwards;
}

@keyframes shiftPanel {
    0% {
        right: 7.5%;
        transform: perspective(1000px) rotateY(0);
    }
    50% {
        right: 7.5%;
        transform: perspective(3000px) rotateY(-10deg);
    }
    60% {
        right: 7.5%;
        transform: perspective(3000px) rotateY(-10deg);
    }
    100% {
        right: 1.5%;
        transform: perspective(3000px) rotateY(-10deg);
    }
}

@keyframes shiftBackPanel {
    0% {
        right: 1.5%;
        transform: perspective(3000px) rotateY(-10deg);
    }
    40% {
        right: 7.5%;
        transform: perspective(3000px) rotateY(-10deg);
    }
    50% {
        right: 7.5%;
        transform: perspective(3000px) rotateY(-10deg);
    }
    100% {
        right: 7.5%;
        transform: perspective(1000px) rotateY(0);
    }
}
</style>
