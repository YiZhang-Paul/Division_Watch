<template>
    <div class="activities-selection-card-container" @mouseover="isHovering = true" @mouseout="isHovering = false">
        <div class="titles">
            <span class="title">Activities</span>
            <span class="message">Tasks & Interruptions</span>
        </div>

        <div class="content">
            <distribution-chart class="types-chart"
                :groups="itemsDistribution"
                :delay="chartDelay"
                :isMonochrome="isHovering">

                <div class="item-counts">
                    <span class="task-count item-count">
                        <span class="type">Task</span>
                        <counter-display class="counter-display" :value="tasks"></counter-display>
                    </span>

                    <span class="interruption-count item-count">
                        <span class="type">Interruption</span>
                        <counter-display class="counter-display" :value="interruptions"></counter-display>
                    </span>
                </div>
            </distribution-chart>

            <div class="total-estimation">
                <span>Total Estimation:</span>
                <estimation-skulls class="estimation-skulls" :isDarkMode="isHovering"></estimation-skulls>
                <counter-display class="counter-display" :value="totalEstimation"></counter-display>
            </div>

            <div class="minor-charts">
                <div class="chart-wrapper">
                    <span>Popular Categories</span>

                    <div class="inner-wrapper">
                        <distribution-chart class="category-chart"
                            :groups="categoryDistribution"
                            :delay="chartDelay + 200"
                            :isMonochrome="isHovering">
                        </distribution-chart>

                        <counter-display class="counter-display" :value="categoryDistribution.length"></counter-display>
                    </div>
                </div>

                <div class="chart-wrapper">
                    <span>High Value Targets</span>

                    <div class="inner-wrapper">
                        <distribution-chart class="priority-chart"
                            :groups="priorityDistribution"
                            :delay="chartDelay + 200"
                            :isMonochrome="isHovering">
                        </distribution-chart>

                        <counter-display class="counter-display" :value="highpriorityTargets"></counter-display>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import store from '../../../store';
import { categoryKey } from '../../../store/category/category.state';
import { taskItemKey } from '../../../store/task-item/task-item.state';
// eslint-disable-next-line no-unused-vars
import { Category } from '../../../core/data-model/generic/category';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../../core/data-model/task-item/task-item';
import { DistributionGroup } from '../../../core/data-model/generic/distribution-group';
import DistributionChart from '../../../shared/widgets/DistributionChart.vue';
import EstimationSkulls from '../../../shared/widgets/EstimationSkulls.vue';
import CounterDisplay from '../../../shared/widgets/CounterDisplay.vue';

class ActivitiesSelectionCardProp {
    public chartDelay = prop<number>({ default: 3200 });
}

@Options({
    components: {
        DistributionChart,
        EstimationSkulls,
        CounterDisplay
    }
})
export default class ActivitiesSelectionCard extends Vue.with(ActivitiesSelectionCardProp) {
    public isHovering = false;

    get tasks(): number {
        return store.getters[`${taskItemKey}/incompleteParentTasks`].length;
    }

    get interruptions(): number {
        return store.getters[`${taskItemKey}/incompleteInterruptions`].length;
    }

    get totalEstimation(): number {
        return store.getters[`${taskItemKey}/totalEstimation`];
    }

    get highpriorityTargets(): number {
        const items: TaskItem[] = store.getters[`${taskItemKey}/incompleteItems`];

        return items.filter(_ => _.priority.rank === 2).length;
    }

    get itemsDistribution(): DistributionGroup[] {
        const childTasks = store.getters[`${taskItemKey}/incompleteChildTasks`].length;
        const parentTaskName = `parent task${this.tasks > 1 ? 's' : ''}`;
        const childTaskName = `child task${childTasks > 1 ? 's' : ''}`;
        const interruptionName = `interruption${this.interruptions > 1 ? 's' : ''}`;

        return [
            new DistributionGroup(parentTaskName, this.tasks, 'rgb(245, 114, 8)'),
            new DistributionGroup(childTaskName, childTasks, 'rgb(222, 241, 47)'),
            new DistributionGroup(interruptionName, this.interruptions, 'rgb(83, 191, 252)')
        ];
    }

    get categoryDistribution(): DistributionGroup[] {
        if (!store.getters[`${categoryKey}/categories`].length) {
            return [];
        }

        const distribution = new Map<string, number>();
        const items: TaskItem[] = store.getters[`${taskItemKey}/incompleteItems`];

        for (const item of items.filter(_ => _.categoryId)) {
            distribution.set(item.categoryId!, (distribution.get(item.categoryId!) ?? 0) + 1);
        }

        return Array.from(distribution).sort((a, b) => b[1] - a[1]).slice(0, 3).map(_ => {
            const category: Category = store.getters[`${categoryKey}/category`](_[0]);

            return new DistributionGroup(category.name, _[1], category.color);
        });
    }

    get priorityDistribution(): DistributionGroup[] {
        const items: TaskItem[] = store.getters[`${taskItemKey}/incompleteItems`];
        const priorities = new Array(3).fill(0).map((_, i) => i);
        const groups = priorities.map(rank => items.filter(_ => _.priority.rank === rank));
        const colors = ['rgb(73, 207, 73)', 'rgb(238, 171, 70)', 'rgb(231, 72, 72)'];

        return groups.map((_, i) => {
            const name = `${(_[0]?.priority?.name ?? '').toLowerCase()} priority`;

            return new DistributionGroup(name, _.length, colors[i]);
        });
    }
}
</script>

<style lang="scss" scoped>
.activities-selection-card-container {
    padding-top: 0.6rem;
    width: 100%;
    height: 100%;
    font-size: 0.6rem;

    &:hover {
        color: rgba(35, 35, 35, 0.9);

        .counter-display {
            color: rgba(30, 30, 30, 0.9);

            ::v-deep .placeholder {
                color: rgba(30, 30, 30, 0.4);
            }
        }

        .titles .message {
            color: rgba(45, 45, 45, 0.8);
        }

        .types-chart .task-count span,
        .types-chart .interruption-count span {
            color: rgba(35, 35, 35, 0.9);
        }

        .total-estimation {
            border-top: 1px solid rgba(45, 45, 45, 0.2);
            border-bottom: 1px solid rgba(45, 45, 45, 0.2);

            .estimation-skulls {
                filter: invert(0%) sepia(1%) saturate(7%) hue-rotate(70deg) brightness(103%) contrast(100%);
            }
        }

        .minor-charts .chart-wrapper:nth-child(1) {
            border-right: 1px solid rgba(45, 45, 45, 0.2);
        }
    }

    .titles {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .title {
            line-height: 1.1rem;
            font-size: 1.15rem;
        }

        .message {
            color: rgb(215, 215, 215);
            transition: color 0.25s;
            font-size: 0.55rem;
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        flex-grow: 1;
        width: 100%;
    }

    .total-estimation {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 1.6rem;
        border-top: 1px solid rgba(225, 225, 225, 0.1);
        border-bottom: 1px solid rgba(225, 225, 225, 0.1);
        font-size: 0.575rem;
        overflow: hidden;
        transition: border 0.3s;
        opacity: 0;
        animation: revealContent 0.3s ease 0.5s forwards;

        .estimation-skulls {
            margin-left: 0.2rem;
            margin-bottom: 0.15rem;
            width: 1rem;
            height: 1.15rem;
        }

        .counter-display {
            margin-top: 0.06rem;
        }
    }

    .types-chart, .priority-chart, .category-chart {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        opacity: 0;
        animation: revealContent 0.3s ease-in 0.35s forwards;

        .item-counts {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            transition: color 0.25s;
        }

        .item-count {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 0.6rem;

            .counter-display {
                font-size: 1.4rem;
                line-height: 1.5rem;
            }
        }
    }

    .types-chart {
        width: 23.25vh;
        height: 23.25vh;

        .task-count .type {
            color: rgb(245, 114, 8);
        }

        .interruption-count .type {
            color: rgb(83, 191, 252);
        }
    }

    .minor-charts {
        display: flex;
        flex-grow: 1;
        width: 100%;
        opacity: 0;
        animation: revealContent 0.3s ease 0.5s forwards;

        .chart-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 50%;
            height: 100%;
            transition: border 0.3s;

            &:nth-child(1) {
                border-right: 1px solid rgba(225, 225, 225, 0.05);
            }

            & > span {
                font-size: 0.45rem;
            }

            .inner-wrapper {
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;

                .counter-display {
                    position: absolute;
                    font-size: 0.9rem;
                }

                .priority-chart, .category-chart {
                    margin-bottom: 2.5%;
                    width: 10.5vh;
                    height: 10.5vh;
                }
            }
        }
    }
}
</style>
