<template>
    <view-panel @click="deselect()">
        <template v-slot:header>
            <div class="header-content">
                <title-panel :activeGrid="1">Planner</title-panel>
            </div>
        </template>

        <div class="main-content">
            <planner-item-list class="planner-item-list"
                :plan="plan"
                :selected="selectedItem"
                @item:select="$emit('item:select', $event)">
            </planner-item-list>

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
                        :isDisabled="isDragDisabled"
                        @planned:change="onPlanChange('planned', $event)"
                        @potential:change="onPlanChange('potential', $event)">
                    </planner-target-list>
                </div>
            </div>
        </div>

        <template v-if="!selectedItem" v-slot:footer>
            <div class="footer-content">
                <menu-button class="back-button" @click="$emit('view:back')">Back</menu-button>
                <menu-button class="close-button" @click="$emit('view:close')">Close</menu-button>
            </div>
        </template>
    </view-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import store from '../../../store';
import { dailyPlanKey } from '../../../store/daily-plan/daily-plan.state';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../../core/data-model/task-item/task-item';
// eslint-disable-next-line no-unused-vars
import { DailyPlan } from '../../../core/data-model/generic/daily-plan';
// eslint-disable-next-line no-unused-vars
import { GoalOptions } from '../../../core/data-model/generic/goal-options';
import TitlePanel from '../../../shared/panels/TitlePanel.vue';
import ViewPanel from '../../../shared/panels/ViewPanel.vue';
import MenuButton from '../../../shared/controls/MenuButton.vue';

import PlannerItemList from './PlannerItemList.vue';
import GoalSelector from './GoalSelector.vue';
import PlannerTargetList from './PlannerTargetList.vue';

class PlanViewerProp {
    public plan = prop<DailyPlan>({ default: null });
    public goalOptions = prop<GoalOptions>({ default: null });
    public selectedItem = prop<TaskItem>({ default: null });
    public isDragDisabled = prop<boolean>({ default: false });
}

@Options({
    components: {
        TitlePanel,
        ViewPanel,
        MenuButton,
        PlannerItemList,
        GoalSelector,
        PlannerTargetList
    },
    emits: [
        'plan:change',
        'item:select',
        'view:back',
        'view:close'
    ]
})
export default class PlanViewer extends Vue.with(PlanViewerProp) {
    private updateDebounceTimer: NodeJS.Timeout | null = null;

    get currentEstimation(): number {
        return store.getters[`${dailyPlanKey}/currentEstimation`];
    }

    public beforeUnmount(): void {
        if (this.updateDebounceTimer) {
            this.$emit('plan:change', this.plan);
        }
    }

    public deselect(): void {
        if (this.selectedItem) {
            this.$emit('item:select', null);
        }
    }

    public onPlanChange<T>(key: string, value: T): void {
        (this.plan as any)[key] = value;

        if (this.updateDebounceTimer) {
            clearTimeout(this.updateDebounceTimer);
        }

        this.updateDebounceTimer = setTimeout(async() => {
            this.$emit('plan:change', this.plan);
            this.updateDebounceTimer = null;
        }, 20);
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
