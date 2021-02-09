<template>
    <div class="activities-selection-card-container">
        <div class="titles">
            <span class="title">Activities</span>
            <span class="message">tasks & interruptions</span>
        </div>

        <div class="distribution-charts">
            <distribution-chart class="chart" :groups="itemsDistribution" :renderDelay="chartDelay">
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

            <distribution-chart class="chart"
                :groups="priorityDistribution"
                :renderDelay="chartDelay">
            </distribution-chart>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import store from '../../../store';
import { taskItemKey } from '../../../store/task-item/task-item.state';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../../core/data-model/task-item/task-item';
import { DistributionGroup } from '../../../core/data-model/generic/distribution-group';
import DistributionChart from '../../../shared/widgets/DistributionChart.vue';

class ActivitiesSelectionCardProp {
    public chartDelay = prop<number>({ default: 3200 });
}

@Options({
    components: { DistributionChart }
})
export default class ActivitiesSelectionCard extends Vue.with(ActivitiesSelectionCardProp) {

    get tasks(): number {
        return store.getters[`${taskItemKey}/incompleteParentTasks`].length;
    }

    get interruptions(): number {
        return store.getters[`${taskItemKey}/incompleteInterruptions`].length;
    }

    get itemsDistribution(): DistributionGroup[] {
        const childTasks = store.getters[`${taskItemKey}/incompleteChildTasks`].length;
        const parentTaskName = `parent task${this.tasks > 1 ? 's' : ''}`;
        const childTaskName = `child task${childTasks > 1 ? 's' : ''}`;
        const interruptionName = `interruption${this.interruptions > 1 ? 's' : ''}`;

        return [
            new DistributionGroup(parentTaskName, this.tasks, 'rgb(246, 39, 226)'),
            new DistributionGroup(childTaskName, childTasks, 'rgb(255, 255, 255)', false),
            new DistributionGroup(interruptionName, this.interruptions, 'rgb(83, 191, 252)')
        ];
    }

    get priorityDistribution(): DistributionGroup[] {
        const items: TaskItem[] = store.getters[`${taskItemKey}/incompleteItems`];
        const priorities = new Array(3).fill(0).map((_, i) => i);
        const groups = priorities.map(rank => items.filter(_ => _.priority.rank === rank));
        const colors = ['rgb(73, 207, 73)', 'rgb(238, 171, 70)', 'rgb(231, 72, 72)'];

        return groups.map((_, i) => {
            const name = `${(_[0]?.priority?.name ?? '').toLowerCase()} priority`;
            const highlight = i === groups.length - 1;

            return new DistributionGroup(name, _.length, colors[i], highlight);
        });
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
            line-height: 1.5rem;
            font-size: 2rem;
        }

        .message {
            color: rgb(215, 215, 215);
        }
    }

    .distribution-charts {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        width: 29.5vh;
        height: 29.5vh;
        opacity: 0;
        animation: revealContent 0.3s ease-in 0.35s forwards;

        .chart, .item-counts {
            transform: rotate(180deg);
            transform-origin: 50% 50%;
        }

        .chart {
            position: absolute;
            width: 100%;
            height: 100%;
        }

        .chart:nth-child(2) {
            width: 90%;
            height: 90%;
            transform: rotateX(180deg);
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
}
</style>
