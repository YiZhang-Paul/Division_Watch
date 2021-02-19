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

                        <div class="count-wrapper">
                            <span class="placeholder">{{ tasksPlaceholder }}</span>
                            <span class="total">{{ tasks }}</span>
                        </div>
                    </span>

                    <span class="interruption-count item-count">
                        <span class="type">Interruption</span>

                        <div class="count-wrapper">
                            <span class="placeholder">{{ interruptionsPlaceholder }}</span>
                            <span class="total">{{ interruptions }}</span>
                        </div>
                    </span>
                </div>
            </distribution-chart>

            <div class="total-estimation">
                <span>Total Estimation:</span>
                <estimation-skulls class="estimation-skulls" :isDarkMode="isHovering"></estimation-skulls>
                <span class="placeholder">{{ totalEstimationPlaceholder }}</span>
                <span class="estimation">{{ totalEstimation }}</span>
            </div>

            <div class="minor-charts">
                <div class="chart-wrapper">
                    <distribution-chart class="category-chart"
                        :groups="categoryDistribution"
                        :delay="chartDelay + 200"
                        :isMonochrome="isHovering">
                    </distribution-chart>
                </div>

                <div class="chart-wrapper">
                    <distribution-chart class="priority-chart"
                        :groups="priorityDistribution"
                        :delay="chartDelay + 200"
                        :isMonochrome="isHovering">
                    </distribution-chart>
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
import { GenericUtility } from '../../../core/utilities/generic/generic.utility';

class ActivitiesSelectionCardProp {
    public chartDelay = prop<number>({ default: 3200 });
}

@Options({
    components: {
        DistributionChart,
        EstimationSkulls
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

    get tasksPlaceholder(): string {
        return GenericUtility.getLeadingZeros(this.tasks);
    }

    get interruptionsPlaceholder(): string {
        return GenericUtility.getLeadingZeros(this.interruptions);
    }

    get totalEstimation(): number {
        return store.getters[`${taskItemKey}/totalEstimation`];
    }

    get totalEstimationPlaceholder(): string {
        return GenericUtility.getLeadingZeros(Math.round(this.totalEstimation));
    }

    get itemsDistribution(): DistributionGroup[] {
        const childTasks = store.getters[`${taskItemKey}/incompleteChildTasks`].length;
        const parentTaskName = `parent task${this.tasks > 1 ? 's' : ''}`;
        const childTaskName = `child task${childTasks > 1 ? 's' : ''}`;
        const interruptionName = `interruption${this.interruptions > 1 ? 's' : ''}`;

        return [
            new DistributionGroup(parentTaskName, this.tasks, 'rgb(246, 39, 226)'),
            new DistributionGroup(childTaskName, childTasks, 'rgb(206, 241, 47)'),
            new DistributionGroup(interruptionName, this.interruptions, 'rgb(83, 191, 252)')
        ];
    }

    get categoryDistribution(): DistributionGroup[] {
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

        .titles .message {
            color: rgba(45, 45, 45, 0.8);
        }

        .total-estimation {

            .estimation-skulls {
                filter: invert(0%) sepia(1%) saturate(7%) hue-rotate(70deg) brightness(103%) contrast(100%);
            }

            .placeholder {
                color: rgba(30, 30, 30, 0.3);
            }
        }

        .types-chart .task-count,
        .types-chart .interruption-count {

            span {
                color: rgba(35, 35, 35, 0.9);
            }

            .count-wrapper .placeholder {
                color: rgba(30, 30, 30, 0.3);
            }
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

        .estimation-skulls {
            margin-left: 0.2rem;
            margin-bottom: 0.15rem;
            width: 1rem;
            height: 1.15rem;
        }

        .placeholder, .estimation {
            margin-top: 0.06rem;
        }

        .placeholder {
            color: rgba(225, 225, 225, 0.25);
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
            font-size: 0.65rem;

            .count-wrapper {
                font-size: 1.5rem;
                line-height: 1.6rem;

                .placeholder {
                    color: rgba(225, 225, 225, 0.25);
                }
            }
        }
    }

    .types-chart {
        width: 24.25vh;
        height: 24.25vh;

        .task-count .type {
            color: rgb(246, 39, 226);
        }

        .interruption-count .type {
            color: rgb(83, 191, 252);
        }
    }

    .minor-charts {
        display: flex;
        flex-grow: 1;
        width: 100%;

        .chart-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50%;
            height: 100%;

            &:nth-child(1) {
                border-right: 1px solid rgba(225, 225, 225, 0.05);
            }
        }
    }

    .priority-chart, .category-chart {
        width: 11.5vh;
        height: 11.5vh;
    }
}
</style>
