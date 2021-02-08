<template>
    <div class="task-manager-container">
        <item-list-panel class="item-list-panel" @search="searchText = $event">
            <task-summary-card class="summary-card"
                v-for="task of tasks"
                :key="task.id"
                :task="task"
                @click="onTaskSelected(task)">
            </task-summary-card>
        </item-list-panel>

        <div v-if="activeTask" class="editor-area">
            <section-panel class="basic-information"
                :name="activeTask.name"
                :isEditable="true"
                :placeholder="'enter task name here...'"
                @name:edited="onItemChange('name', $event)">

                <option-dropdown class="editor-control"
                    :name="'Category'"
                    :selected="selectedCategory"
                    :options="categories"
                    :transform="_ => _.name"
                    @options:select="onItemChange('categoryId', $event.id)">
                </option-dropdown>

                <option-dropdown class="editor-control"
                    :name="'Priority'"
                    :selected="activeTask.priority"
                    :options="taskOptions.priorities"
                    :transform="_ => _.name"
                    @options:select="onItemChange('priority', $event)">
                </option-dropdown>

                <option-dropdown class="editor-control"
                    :name="'Deadline'"
                    :selected="activeTask.deadline"
                    :options="taskOptions.deadlines"
                    :transform="toDisplayDate"
                    @options:select="onItemChange('deadline', $event)">
                </option-dropdown>

                <option-dropdown class="editor-control"
                    :name="'Estimate'"
                    :selected="activeTask.estimate"
                    :options="taskOptions.estimates"
                    :isDisabled="activeChildTasks.length"
                    :disableText="activeChildTasksEstimation"
                    :transform="toDisplayEstimation"
                    @options:select="onItemChange('estimate', $event)">
                </option-dropdown>

                <day-selector class="editor-control"
                    :name="'Recur'"
                    :days="activeTask.recur.slice()"
                    :isDisabled="activeTask.parent"
                    @days:select="onItemChange('recur', $event)">
                </day-selector>
            </section-panel>

            <div class="subsections">
                <section-panel class="child-tasks"
                    :name="'Subtasks (' + activeChildTasks.length + ')'"
                    :isSubsection="true">

                    <subtask-summary-card class="subtask-summary-card"
                        v-for="task of activeChildTasks"
                        :key="task.id"
                        :task="task">
                    </subtask-summary-card>
                </section-panel>

                <section-panel class="checklist-items"
                    :name="'Checklist'"
                    :isSubsection="true">
                </section-panel>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../store';
import { categoryKey } from '../../store/category/category.state';
import { taskItemKey } from '../../store/task-item/task-item.state';
import { Category } from '../../core/data-model/generic/category';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
// eslint-disable-next-line no-unused-vars
import { TaskItemOptions } from '../../core/data-model/task-item/task-item-options';
import ItemListPanel from '../../shared/panels/ItemListPanel.vue';
import SectionPanel from '../../shared/panels/SectionPanel.vue';
import OptionDropdown from '../../shared/controls/OptionDropdown.vue';
import DaySelector from '../../shared/controls/DaySelector.vue';
import TaskSummaryCard from '../../shared/cards/TaskSummaryCard.vue';
import SubtaskSummaryCard from '../../shared/cards/SubtaskSummaryCard.vue';
import { TimeUtility } from '../../core/utilities/time/time.utility';

@Options({
    components: {
        ItemListPanel,
        SectionPanel,
        OptionDropdown,
        DaySelector,
        TaskSummaryCard,
        SubtaskSummaryCard
    }
})
export default class TaskManager extends Vue {
    public searchText = '';
    private updateDebounceTimer: NodeJS.Timeout | null = null;

    get taskOptions(): TaskItemOptions {
        return store.getters[`${taskItemKey}/taskItemOptions`];
    }

    get categories(): Category[] {
        const categories: Category[] = store.getters[`${categoryKey}/categories`];

        return [new Category('N/A'), ...categories];
    }

    get selectedCategory(): Category {
        return store.getters[`${categoryKey}/category`](this.activeTask?.categoryId);
    }

    get activeTask(): TaskItem | null {
        return store.getters[`${taskItemKey}/activeItem`];
    }

    get activeChildTasks(): TaskItem[] {
        if (!this.activeTask) {
            return [];
        }

        return store.getters[`${taskItemKey}/incompleteChildTasksByParentId`](this.activeTask.id);
    }

    get activeChildTasksEstimation(): string {
        const estimation = this.activeChildTasks.reduce((total, _) => total + _.estimate, 0);

        return this.toDisplayEstimation(estimation);
    }

    get tasks(): TaskItem[] {
        const tasks: TaskItem[] = store.getters[`${taskItemKey}/incompleteParentTasks`];

        return tasks.filter(_ => _.name.toLowerCase().includes(this.searchText));
    }

    public beforeUnmount(): void {
        if (this.updateDebounceTimer) {
            store.dispatch(`${taskItemKey}/updateTaskItem`, this.activeTask);
        }
    }

    public onItemChange(key: string, value: any): void {
        const changed = { ...this.activeTask!, [key]: value };
        store.commit(`${taskItemKey}/setActiveItem`, changed);

        if (!changed.id) {
            return;
        }

        if (this.updateDebounceTimer) {
            clearTimeout(this.updateDebounceTimer);
        }

        this.updateDebounceTimer = setTimeout(() => {
            store.dispatch(`${taskItemKey}/updateTaskItem`, this.activeTask);
            this.updateDebounceTimer = null;
        }, 1000);
    }

    public onTaskSelected(task: TaskItem): void {
        store.dispatch(`${taskItemKey}/swapActiveItem`, task);
    }

    public toDisplayDate(raw: string): string {
        return raw ? TimeUtility.toShortDateString(raw) : 'N/A';
    }

    public toDisplayEstimation(time: number): string {
        return TimeUtility.toEstimationString(time, this.taskOptions.skullDuration);
    }
}
</script>

<style lang="scss" scoped>
.task-manager-container {
    $list-width: 30%;

    .item-list-panel {
        width: $list-width;
        height: 95%;

        .summary-card {
            width: 100%;
            height: 12.5vh;

            &:not(:nth-last-child(1)) {
                margin-bottom: 1vh;
            }
        }
    }

    .editor-area {
        $content-width: 95%;

        display: flex;
        flex-direction: column;
        align-items: center;
        width: calc(100% - #{$list-width});
        height: 100%;

        .basic-information {
            width: $content-width;
            height: 50%;

            .editor-control {
                width: 100%;
            }
        }

        .subsections {
            display: flex;
            margin-top: 3%;
            width: calc(#{$content-width} - 3.5%);
            height: 35%;

            .child-tasks, .checklist-items {
                width: 50%;
                height: 100%;
            }

            .subtask-summary-card {
                width: 100%;
                height: 5vh;
            }
        }
    }
}
</style>
