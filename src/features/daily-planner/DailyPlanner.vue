<template>
    <view-panel>
        <template v-slot:header>
            <div class="header-content">
                <title-panel :activeGrid="1">Planner</title-panel>
            </div>
        </template>

        <div class="main-content">
            <div class="list-wrapper">
                <div class="filters">
                    <div class="filter">
                        <checkbox class="checkbox" v-model="showTask"></checkbox>
                        <span>Show Task</span>
                    </div>

                    <div class="filter">
                        <checkbox class="checkbox" v-model="showInterruption"></checkbox>
                        <span>Show Interruption</span>
                    </div>
                </div>

                <item-list-panel class="item-list-panel"
                    :allowAdd="false"
                    @item:search="searchText = $event">

                    <task-summary-card class="summary-card"
                        v-for="candidate of candidates"
                        :key="candidate.id"
                        :task="candidate"
                        :isUrgent="candidate.isInterruption"
                        @mouseenter="onCardHover()">
                    </task-summary-card>

                    <placeholder-panel v-if="!candidates.length"
                        class="placeholder-panel"
                        :text="searchText ? 'no matching entry found.' : 'no entry available.'">
                    </placeholder-panel>
                </item-list-panel>
            </div>

            <div v-if="plan" class="content">
                <div class="plan-details">
                    <goal-selector class="goal-selector"
                        :goal="plan.goal"
                        :options="goalOptions"
                        @select="onPlanChange('goal', $event)">
                    </goal-selector>
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
import { soundKey } from '../../store/sound/sound.state';
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
import { SoundOption } from '../../core/data-model/generic/sound-option';
import TaskSummaryCard from '../../shared/cards/TaskSummaryCard.vue';
import TitlePanel from '../../shared/panels/TitlePanel.vue';
import ViewPanel from '../../shared/panels/ViewPanel.vue';
import ItemListPanel from '../../shared/panels/ItemListPanel.vue';
import PlaceholderPanel from '../../shared/panels/PlaceholderPanel.vue';
import MenuButton from '../../shared/controls/MenuButton.vue';
import Checkbox from '../../shared/controls/Checkbox.vue';
import { ViewOption } from '../../core/enums/view-option.enum';
import { SoundType } from '../../core/enums/sound-type.enum';

import GoalSelector from './GoalSelector.vue';

@Options({
    components: {
        TaskSummaryCard,
        TitlePanel,
        ViewPanel,
        ItemListPanel,
        PlaceholderPanel,
        MenuButton,
        Checkbox,
        GoalSelector
    }
})
export default class DailyPlanner extends Vue {
    public showTask = true;
    public showInterruption = true;
    public searchText = '';
    private updateDebounceTimer: NodeJS.Timeout | null = null;

    get candidates(): TaskItem[] {
        if (!this.showTask && !this.showInterruption) {
            return [];
        }

        let items: TaskItem[];

        if (this.showTask && this.showInterruption) {
            items = store.getters[`${taskItemKey}/incompleteInterruptionsAndParentTasks`];
        }
        else if (this.showTask) {
            items = store.getters[`${taskItemKey}/incompleteParentTasks`];
        }
        else {
            items = store.getters[`${taskItemKey}/incompleteInterruptions`];
        }

        return items.filter(_ => _.name.toLowerCase().includes(this.searchText));
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

    public onCardHover(): void {
        store.dispatch(`${soundKey}/playSound`, new SoundOption('button_hover', SoundType.UI));
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

        this.updateDebounceTimer = setTimeout(() => {
            store.dispatch(`${dailyPlanKey}/upsertDailyPlan`, this.plan);
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

    .list-wrapper {
        display: flex;
        flex-direction: column;
        width: $list-width;
        height: 97.5%;

        .filters {
            display: flex;
            align-items: flex-end;
            width: 100%;
            height: 1rem;

            .filter {
                display: flex;
                align-items: center;
                color: rgb(255, 255, 255);
                font-size: 0.475rem;

                &:nth-child(1) {
                    margin-right: 0.75rem;
                }

                .checkbox {
                    margin-right: 0.275rem;
                    width: 0.425rem;
                    height: 0.425rem;
                }
            }
        }

        .item-list-panel {
            width: 100%;
            height: calc(100% - 1rem);

            .summary-card {
                width: 100%;
                height: 10.5vh;
                opacity: 0;
                animation: revealContent 0.3s ease 0.1s forwards;

                &:not(:nth-last-child(1)) {
                    margin-bottom: 0.9vh;
                }
            }

            .placeholder-panel {
                margin-left: 2.5%;
                width: 95%;
            }
        }
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

            .goal-selector {
                width: 100%;
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
