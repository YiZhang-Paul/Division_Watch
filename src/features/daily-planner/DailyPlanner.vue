<template>
    <view-panel>
        <template v-slot:header>
            <div class="header-content">
                <title-panel :activeGrid="1">Planner</title-panel>
            </div>
        </template>

        <div class="main-content">
            <planner-item-list class="planner-item-list" :plan="plan"></planner-item-list>

            <div v-if="plan" class="content">
                <div class="plan-details">
                    <goal-selector class="goal-selector"
                        :goal="plan.goal"
                        :options="goalOptions"
                        :estimation="currentEstimation"
                        @select="onPlanChange('goal', $event)">
                    </goal-selector>

                    <planner-target-list class="planner-target-list"
                        :plan="plan"
                        :groupName="groupName"
                        :dragTarget="dragTarget"
                        :isDisabled="isDragDisabled"
                        @planned:change="onPlanChange('planned', $event)"
                        @potential:change="onPlanChange('potential', $event)"
                        @group:move="dragTarget = $event">
                    </planner-target-list>
                </div>
            </div>
        </div>

        <template v-slot:footer>
            <div class="footer-content">
                <menu-button class="back-button" @click="backToMain()">Back</menu-button>
                <menu-button class="close-button" @click="closePanel()">Close</menu-button>
            </div>
        </template>
    </view-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../store';
import { mainViewKey } from '../../store/main-view/main-view.state';
import { dailyPlanKey } from '../../store/daily-plan/daily-plan.state';
// eslint-disable-next-line no-unused-vars
import { Goal } from '../../core/data-model/generic/goal';
// eslint-disable-next-line no-unused-vars
import { GoalOptions } from '../../core/data-model/generic/goal-options';
// eslint-disable-next-line no-unused-vars
import { DailyPlan } from '../../core/data-model/generic/daily-plan';
import TitlePanel from '../../shared/panels/TitlePanel.vue';
import ViewPanel from '../../shared/panels/ViewPanel.vue';
import MenuButton from '../../shared/controls/MenuButton.vue';
import { ViewOption } from '../../core/enums/view-option.enum';

import PlannerItemList from './PlannerItemList.vue';
import GoalSelector from './GoalSelector.vue';
import PlannerTargetList from './PlannerTargetList.vue';

@Options({
    components: {
        TitlePanel,
        ViewPanel,
        MenuButton,
        PlannerItemList,
        GoalSelector,
        PlannerTargetList
    }
})
export default class DailyPlanner extends Vue {
    public readonly groupName = 'items';
    public isDragDisabled = false;
    public dragTarget = '';
    private updateDebounceTimer: NodeJS.Timeout | null = null;

    get currentEstimation(): number {
        return store.getters[`${dailyPlanKey}/currentEstimation`];
    }

    get goalOptions(): GoalOptions {
        return store.getters[`${dailyPlanKey}/goalOptions`];
    }

    get plan(): DailyPlan | null {
        return store.getters[`${dailyPlanKey}/currentPlan`];
    }

    public async created(): Promise<void> {
        await Promise.allSettled([
            store.dispatch(`${dailyPlanKey}/loadGoalOptions`),
            store.dispatch(`${dailyPlanKey}/loadCurrentPlan`)
        ]);

        if (this.plan) {
            const total = this.plan.goal.sessions * this.plan.goal.sessionDuration;
            const sessions = Math.round(total / this.goalOptions.sessionDuration);
            const adjusted = Math.min(sessions, this.goalOptions.sessions.max);
            const goal = { sessions: adjusted, sessionDuration: this.goalOptions.sessionDuration } as Goal;
            this.onPlanChange('goal', goal);
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

    public onPlanChange<T>(key: string, value: T): void {
        const plan = { ...this.plan, [key]: value } as DailyPlan;
        store.commit(`${dailyPlanKey}/setCurrentPlan`, plan);

        if (this.updateDebounceTimer) {
            clearTimeout(this.updateDebounceTimer);
        }

        this.updateDebounceTimer = setTimeout(async() => {
            this.isDragDisabled = true;
            await store.dispatch(`${dailyPlanKey}/upsertDailyPlan`, this.plan);
            this.isDragDisabled = false;
            this.updateDebounceTimer = null;
        }, 400);
    }
}
</script>

<style lang="scss" scoped>
.header-content, .main-content, .footer-content {
    display: flex;
    width: 100%;
    height: 100%;
}

.header-content {
    align-items: flex-end;
}

.main-content {
    $margin: 1.5%;
    $list-width: 28%;
    $content-width: 96.5%;

    margin-left: $margin;
    width: calc(100% - #{$margin} * 2);

    .planner-item-list {
        width: $list-width;
        height: 97.5%;
    }

    .content {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        width: calc((100% - #{$list-width}));
        height: 100%;

        .plan-details {
            padding-top: 1.5vh;
            width: $content-width;
            height: 100%;

            .goal-selector {
                width: 100%;
            }

            .planner-target-list {
                margin-top: 3.5%;
                width: 100%;
                height: 70%;
            }
        }
    }
}

.footer-content {
    align-items: center;

    .back-button, .close-button {
        width: 4.75vw;
        height: 3.5vh;
    }

    .back-button {
        margin-right: 1.5%;
        color: rgb(255, 255, 255);
    }

    .close-button {
        color: rgb(240, 123, 14);
    }
}
</style>
