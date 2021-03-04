<template>
    <div class="planner-item-list-container">
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

            <draggable v-model="candidates"
                item-key="id"
                :sort="false"
                :group="{ name: groupName, pull: 'clone', put: false }"
                :move="_ => $emit('group:move', _.to.className)"
                @end="$emit('group:move', '')">

                <template #item="{ element }">
                    <task-summary-card class="summary-card"
                        :task="element"
                        :isUrgent="element.isInterruption"
                        @mouseenter="onCardHover()">
                    </task-summary-card>
                </template>
            </draggable>

            <placeholder-panel v-if="!candidates.length"
                class="placeholder-panel"
                :text="searchText ? 'no matching entry found.' : 'no entry available.'">
            </placeholder-panel>
        </item-list-panel>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import Draggable from 'vuedraggable';

import store from '../../store';
import { dailyPlanKey } from '../../store/daily-plan/daily-plan.state';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
// eslint-disable-next-line no-unused-vars
import { DailyPlan } from '../../core/data-model/generic/daily-plan';
import TaskSummaryCard from '../../shared/cards/TaskSummaryCard.vue';
import Checkbox from '../../shared/controls/Checkbox.vue';
import ItemListPanel from '../../shared/panels/ItemListPanel.vue';
import PlaceholderPanel from '../../shared/panels/PlaceholderPanel.vue';

class PlannerItemListProp {
    public plan = prop<DailyPlan>({ default: null });
    public groupName = prop<string>({ default: 'group' });
}

@Options({
    components: {
        Draggable,
        TaskSummaryCard,
        Checkbox,
        ItemListPanel,
        PlaceholderPanel
    },
    emits: ['group:move']
})
export default class PlannerItemList extends Vue.with(PlannerItemListProp) {
    public searchText = '';
    public showTask = true;
    public showInterruption = true;

    get candidates(): TaskItem[] {
        const payload = { showTask: this.showTask, showInterruption: this.showInterruption };
        const candidates: TaskItem[] = store.getters[`${dailyPlanKey}/candidates`](payload);
        const exclude = new Set([...this.plan?.planned ?? [], ...this.plan?.potential ?? []]);

        return candidates.filter(_ => !exclude.has(_.id ?? '') && _.name.toLowerCase().includes(this.searchText));
    }
}
</script>

<style lang="scss" scoped>
.planner-item-list-container {
    display: flex;
    flex-direction: column;

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
</style>
