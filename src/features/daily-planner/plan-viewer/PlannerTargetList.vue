<template>
    <div class="planner-target-list-container">
        <item-group-panel class="planned-items"
            :name="'Planned (' + plannedItems.length + ')'"
            :isDisabled="true"
            :placeholder="'cannot add items now.'">

            <draggable v-model="plannedItems"
                item-key="id"
                handle=".list-handle"
                :class="plannedItemsClass"
                :emptyInsertThreshold="30"
                :sort="!isDisabled"
                :group="{ name: 'items', pull: !isDisabled, put: !isDisabled }"
                :move="_ => targetList = _.to.className"
                @end="targetList = ''">

                <template #item="{ element }">
                    <div class="sortable-card">
                        <drag-vertical class="list-handle" />

                        <compact-task-summary-card class="compact-task-summary-card"
                            :task="element"
                            :useCancelEvent="true"
                            @mouseenter="onCardHover()"
                            @cancel="onPlannedItemRemove(element)">
                        </compact-task-summary-card>
                    </div>
                </template>
            </draggable>

            <placeholder-panel v-if="!plannedItems.length && targetList !== plannedItemsClass"
                class="placeholder-panel"
                :text="'nothing selected yet.'">
            </placeholder-panel>
        </item-group-panel>

        <item-group-panel class="potential-items"
            :name="'Potential (' + potentialItems.length + ')'"
            :isDisabled="true"
            :placeholder="'cannot add items now.'">

            <draggable v-model="potentialItems"
                item-key="id"
                handle=".list-handle"
                :class="potentialItemsClass"
                :emptyInsertThreshold="30"
                :sort="!isDisabled"
                :group="{ name: 'items', pull: !isDisabled, put: !isDisabled }"
                :move="_ => targetList = _.to.className"
                @end="targetList = ''">

                <template #item="{ element }">
                    <div class="sortable-card">
                        <drag-vertical class="list-handle" />

                        <compact-task-summary-card class="compact-task-summary-card"
                            :task="element"
                            :useCancelEvent="true"
                            @mouseenter="onCardHover()"
                            @cancel="onPotentialItemRemove(element)">
                        </compact-task-summary-card>
                    </div>
                </template>
            </draggable>

            <placeholder-panel v-if="!potentialItems.length && targetList !== potentialItemsClass"
                class="placeholder-panel"
                :text="'nothing selected yet.'">
            </placeholder-panel>
        </item-group-panel>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { DragVertical } from 'mdue';
import Draggable from 'vuedraggable';

import store from '../../../store';
import { soundKey } from '../../../store/sound/sound.state';
import { dailyPlanKey } from '../../../store/daily-plan/daily-plan.state';
import { SoundOption } from '../../../core/data-model/generic/sound-option';
// eslint-disable-next-line no-unused-vars
import { DailyPlan } from '../../../core/data-model/generic/daily-plan';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../../core/data-model/task-item/task-item';
import CompactTaskSummaryCard from '../../../shared/cards/CompactTaskSummaryCard.vue';
import ItemGroupPanel from '../../../shared/panels/ItemGroupPanel.vue';
import PlaceholderPanel from '../../../shared/panels/PlaceholderPanel.vue';
import { SoundType } from '../../../core/enums/sound-type.enum';

class PlannerTargetListProp {
    public plan = prop<DailyPlan>({ default: null });
    public isDisabled = prop<boolean>({ default: false });
}

@Options({
    components: {
        DragVertical,
        Draggable,
        CompactTaskSummaryCard,
        ItemGroupPanel,
        PlaceholderPanel
    },
    emits: [
        'planned:change',
        'potential:change'
    ]
})
export default class PlannerTargetList extends Vue.with(PlannerTargetListProp) {
    public readonly plannedItemsClass = 'planned-drag-wrapper';
    public readonly potentialItemsClass = 'potential-drag-wrapper';
    public targetList = '';

    get plannedItems(): TaskItem[] {
        return store.getters[`${dailyPlanKey}/plannedItems`];
    }

    set plannedItems(value: TaskItem[]) {
        this.$emit('planned:change', value.map(_ => _.id));
    }

    get potentialItems(): TaskItem[] {
        return store.getters[`${dailyPlanKey}/potentialItems`];
    }

    set potentialItems(value: TaskItem[]) {
        this.$emit('potential:change', value.map(_ => _.id));
    }

    public onCardHover(): void {
        store.dispatch(`${soundKey}/playSound`, new SoundOption('button_hover', SoundType.UI));
    }

    public onPlannedItemRemove(item: TaskItem): void {
        this.$emit('planned:change', this.plan!.planned.filter(_ => _ !== item.id));
    }

    public onPotentialItemRemove(item: TaskItem): void {
        this.$emit('potential:change', this.plan!.potential.filter(_ => _ !== item.id));
    }
}
</script>

<style lang="scss" scoped>
.planner-target-list-container {
    $margin-left: 0.5rem;

    display: flex;
    justify-content: space-between;

    .placeholder-panel {
        box-sizing: border-box;
        margin-left: $margin-left;
        width: calc(95% - #{$margin-left});
        height: 100%;
    }

    .planned-items, .potential-items {
        width: 48.75%;
        height: 100%;

        .planned-drag-wrapper, .potential-drag-wrapper {
            width: 100%;

            .sortable-card {
                margin-left: $margin-left;
                width: calc(100% - #{$margin-left});
                height: 4.5vh;
                opacity: 0;
                animation: revealContent 0.3s ease 0.1s forwards;

                &:not(:nth-last-child(1)) {
                    margin-bottom: 1%;
                }
            }

            .sortable-card {
                display: flex;
                align-items: center;
                position: relative;

                &:hover .list-handle {
                    opacity: 1;
                }

                .list-handle {
                    position: absolute;
                    left: -0.7rem;
                    font-size: 0.9rem;
                    opacity: 0;
                    transition: all 0.3s;

                    &:hover {
                        cursor: grab;
                    }

                    &:active {
                        cursor: grabbing;
                    }
                }

                .compact-task-summary-card {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
}
</style>
