<template>
    <div class="activities-selection-card-container">
        <div class="titles">
            <span class="title">Activities</span>
            <span class="message">tasks & interruptions</span>
        </div>

        <distribution-chart class="distribution-chart" :groups="itemsDistribution">
            <div class="item-counts">
                <span class="task-count">
                    <span>{{ tasks }}&nbsp;</span>
                    <span>task{{ tasks > 1 ? 's' : '' }}</span>
                </span>

                <span class="interruption-count">
                    <span>{{ interruptions }}&nbsp;</span>
                    <span>interruption{{ interruptions > 1 ? 's' : '' }}</span>
                </span>
            </div>
        </distribution-chart>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../../store';
import { taskItemKey } from '../../../store/task-item/task-item.state';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../../core/data-model/task-item/task-item';
import { DistributionGroup } from '../../../core/data-model/generic/distribution-group';
import DistributionChart from '../../../shared/widgets/DistributionChart.vue';

@Options({
    components: { DistributionChart }
})
export default class ActivitiesSelectionCard extends Vue {

    get tasks(): number {
        return store.getters[`${taskItemKey}/incompleteParentTasks`].length;
    }

    get interruptions(): number {
        return store.getters[`${taskItemKey}/incompleteInterruptions`].length;
    }

    get itemsDistribution(): DistributionGroup[] {
        const childTasks = store.getters[`${taskItemKey}/incompleteChildTasks`].length;

        return [
            new DistributionGroup('Parent Task', this.tasks, 'rgb(246, 39, 226)'),
            new DistributionGroup('Child Task', childTasks, 'rgb(255, 255, 255)', false),
            new DistributionGroup('Interruption', this.interruptions, 'rgb(83, 191, 252)')
        ];
    }
}
</script>

<style lang="scss" scoped>
.activities-selection-card-container {
    padding: 0.75rem 0;
    width: 100%;
    height: 100%;
    font-size: 0.8rem;

    .titles {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .title {
            line-height: 1.75rem;
            font-size: 2rem;
        }

        .message {
            color: rgb(215, 215, 215);
        }
    }

    .distribution-chart, .item-counts {
        transform: rotate(180deg);
        transform-origin: 50% 50%;
    }

    .distribution-chart:nth-child(1) {
        width: 30vh;
        height: 30vh;
    }

    .item-counts {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    .task-count span:last-of-type {
        color: rgb(246, 39, 226);
    }

    .interruption-count span:last-of-type {
        color: rgb(83, 191, 252);
    }
}
</style>
