<template>
    <div class="item-inspector-tab-panels-container">
        <div class="tab-buttons">
            <menu-button class="tab-button"
                :class="{ 'active-tab': activeTab === 0 }"
                @click="$emit('tab:select', 0)">

                Subtasks
            </menu-button>

            <menu-button class="tab-button"
                :class="{ 'active-tab': activeTab === 1 }"
                @click="$emit('tab:select', 1)">

                Checklist
            </menu-button>

            <sitemap v-if="activeTab === 0" class="icon" />
            <order-bool-ascending-variant v-if="activeTab === 1" class="icon" />
        </div>

        <div v-if="activeTab === 0" class="subtasks">
            <overlay-scrollbar-panel v-if="childTasks.length" class="overlay-scrollbar-panel">
                <div class="list-wrapper">
                    <compact-task-summary-card v-for="task of childTasks"
                        class="summary-card"
                        :key="task.id"
                        :task="task"
                        :isReadonly="true"
                        @click="$emit('item:select', task.id)">
                    </compact-task-summary-card>
                </div>
            </overlay-scrollbar-panel>

            <placeholder-panel v-if="!childTasks.length"
                class="placeholder-panel"
                :text="'no subtask available.'">
            </placeholder-panel>
        </div>

        <div v-if="activeTab === 1" class="checklist">
            <overlay-scrollbar-panel v-if="item.checklist.length" class="overlay-scrollbar-panel">
                <div class="list-wrapper">
                    <checklist-card v-for="(checklist, index) of item.checklist"
                        class="checklist-card"
                        :key="index"
                        :item="checklist"
                        :isReadonly="true">
                    </checklist-card>
                </div>
            </overlay-scrollbar-panel>

            <placeholder-panel v-if="!item.checklist.length"
                class="placeholder-panel"
                :text="'no checklist available.'">
            </placeholder-panel>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { OrderBoolAscendingVariant, Sitemap } from 'mdue';

import store from '../../../store';
import { taskItemKey } from '../../../store/task-item/task-item.state';
// eslint-disable-next-line no-unused-vars
import { DailyPlan } from '../../../core/data-model/generic/daily-plan';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../../core/data-model/task-item/task-item';
import ChecklistCard from '../../../shared/cards/ChecklistCard.vue';
import CompactTaskSummaryCard from '../../../shared/cards/CompactTaskSummaryCard.vue';
import OverlayScrollbarPanel from '../../../shared/panels/OverlayScrollbarPanel.vue';
import PlaceholderPanel from '../../../shared/panels/PlaceholderPanel.vue';
import MenuButton from '../../../shared/controls/MenuButton.vue';

class ItemInspectorTabPanelsProp {
    public plan = prop<DailyPlan>({ default: null });
    public item = prop<TaskItem>({ default: null });
    public activeTab = prop<number>({ default: 0 });
}

@Options({
    components: {
        OrderBoolAscendingVariant,
        Sitemap,
        ChecklistCard,
        CompactTaskSummaryCard,
        OverlayScrollbarPanel,
        PlaceholderPanel,
        MenuButton
    },
    emits: [
        'tab:select',
        'item:select'
    ]
})
export default class ItemInspectorTabPanels extends Vue.with(ItemInspectorTabPanelsProp) {

    get childTasks(): TaskItem[] {
        if (this.item.isInterruption) {
            return [];
        }

        const children = store.getters[`${taskItemKey}/incompleteChildTasksByParentId`](this.item.id) as TaskItem[];
        const ids = new Set([...this.plan.planned, ...this.plan.potential]);

        return children.filter(_ => !ids.has(_.id ?? ''));
    }
}
</script>

<style lang="scss" scoped>
.item-inspector-tab-panels-container {
    display: flex;
    flex-direction: column;

    .tab-buttons {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        padding: 0 5%;
        width: 100%;
        height: 4.25vh;

        .tab-button {
            margin-top: 2.5%;
            width: 3.5vw;
            height: 2vh;
            color: rgb(255, 255, 255);
            font-size: 0.4rem;

            &:nth-child(1) {
                margin-right: 1.5%;
            }

            &.active-tab {
                background-color: rgb(240, 123, 14);
            }
        }

        .icon {
            align-self: flex-end;
            margin-left: auto;
            color: rgb(255, 255, 255);
            opacity: 0;
            animation: revealContent 0.3s ease forwards;
        }
    }

    .subtasks, .checklist {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: calc(100% - 4.25vh);

        .overlay-scrollbar-panel {
            width: 85%;
            height: 87.5%;

            .list-wrapper {
                width: 100%;
                height: 100%;

                .summary-card, .checklist-card {
                    width: 100%;
                    height: 4.5vh;
                    opacity: 0;
                    animation: revealContent 0.3s ease forwards;

                    &:not(:nth-last-child(1)) {
                        margin-bottom: 1.5%;
                    }
                }
            }
        }

        .placeholder-panel {
            width: 85%;
        }
    }
}
</style>
