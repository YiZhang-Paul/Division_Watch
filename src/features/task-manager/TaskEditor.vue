<template>
    <glass-panel class="task-editor-container">
        <div v-if="!task" class="placeholder-panel">
            <input-panel class="input-item">
                <div class="placeholder-text">No Task Selected.</div>
            </input-panel>
        </div>

        <div v-if="task" class="task-view">
            <input-panel class="input-item">
                <div class="task-name">
                    <input type="text"
                        :value="task.name"
                        @input="onNameChange($event.target.value)"
                        placeholder="enter task name here..." />
                </div>
            </input-panel>

            <option-dropdown class="edit-item"
                :name="'Category'"
                :selected="task.category"
                :options="taskOptions.categories"
                :transform="_ => _.name"
                @options:select="onCategoryChange($event)">
            </option-dropdown>

            <option-dropdown class="edit-item"
                :name="'Priority'"
                :selected="task.priority"
                :options="taskOptions.priorities"
                :transform="_ => _.name"
                @options:select="onPriorityChange($event)">
            </option-dropdown>

            <option-dropdown class="edit-item"
                :name="'Deadline'"
                :selected="task.deadline"
                :options="taskOptions.deadlines"
                :transform="toDisplayDate"
                @options:select="onDeadlineChange($event)">
            </option-dropdown>

            <option-dropdown class="edit-item"
                :name="'Estimate'"
                :selected="task.estimate"
                :options="taskOptions.estimates"
                :transform="toDisplayEstimation"
                @options:select="onEstimateChange($event)">
            </option-dropdown>

            <input-panel class="edit-item">
                <div class="recur-content">
                    <span>Recur</span>

                    <checkbox class="checkbox"
                        :name="'make it daily'"
                        :checked="isDaily"
                        @change="onDailyToggle($event)">
                    </checkbox>
                </div>
            </input-panel>

            <week-day-selector class="day-selector"
                :days="task.recur.slice()"
                @days:select="setRecur($event)">
            </week-day-selector>

            <task-group class="task-group"
                :name="'Subtasks'"
                :parent="task"
                :tasks="childTasks">
            </task-group>
        </div>
    </glass-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../store';
// eslint-disable-next-line no-unused-vars
import { Category } from '../../core/data-model/category';
// eslint-disable-next-line no-unused-vars
import { RankItem } from '../../core/data-model/rank-item';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item';
// eslint-disable-next-line no-unused-vars
import { TaskItemOptions } from '../../core/data-model/task-item-options';
// eslint-disable-next-line no-unused-vars
import { TaskItemOptionsQuery } from '../../core/data-model/task-item-options-query';
import InputPanel from '../../shared/panels/InputPanel.vue';
import GlassPanel from '../../shared/panels/GlassPanel.vue';
import Checkbox from '../../shared/inputs/Checkbox.vue';
import OptionDropdown from '../../shared/inputs/OptionDropdown.vue';
import WeekDaySelector from '../../shared/inputs/WeekDaySelector.vue';
import TaskGroup from '../../shared/components/TaskGroup.vue';

@Options({
    components: {
        InputPanel,
        GlassPanel,
        Checkbox,
        OptionDropdown,
        WeekDaySelector,
        TaskGroup
    }
})
export default class TaskEditor extends Vue {
    private readonly estimationBase = 1500000;

    get task(): TaskItem | null {
        return store.getters['taskItem/activeTaskItem'];
    }

    get childTasks(): TaskItem[] {
        return this.task ? store.getters['taskItem/incompleteChildTasks'](this.task.id) : [];
    }

    get taskOptions(): TaskItemOptions {
        return store.getters['taskItem/taskItemOptions'];
    }

    get isDaily(): boolean {
        if (!this.task) {
            return false;
        }

        return this.task.recur.length === 7 && this.task.recur.every(_ => _);
    }

    public async created(): Promise<void> {
        const currentDate = new Date().toISOString().replace(/T.*/g, '');
        const query: TaskItemOptionsQuery = { estimationBase: this.estimationBase, currentDate };
        await store.dispatch('taskItem/loadTaskItemOptions', query);
    }

    public onNameChange(name: string): void {
        store.commit('taskItem/setActiveTaskItem', { ...this.task, name });
    }

    public onCategoryChange(category: Category): void {
        store.commit('taskItem/setActiveTaskItem', { ...this.task, category });
    }

    public onPriorityChange(priority: RankItem): void {
        store.commit('taskItem/setActiveTaskItem', { ...this.task, priority });
    }

    public onDeadlineChange(deadline: string): void {
        store.commit('taskItem/setActiveTaskItem', { ...this.task, deadline });
    }

    public onEstimateChange(estimate: number): void {
        store.commit('taskItem/setActiveTaskItem', { ...this.task, estimate });
    }

    public onDailyToggle(isDaily: boolean): void {
        if (this.task) {
            this.setRecur(new Array(7).fill(isDaily));
        }
    }

    public setRecur(recur: boolean[]): void {
        store.commit('taskItem/setActiveTaskItem', { ...this.task, recur });
    }

    public toDisplayDate(raw: string): string {
        const [year, month, date] = raw.split('-').map(Number);
        const result = new Date(year, month - 1, date).toDateString();

        return result.replace(/^\S*\s/, '').replace(/(\d)\s(\d)/, '$1, $2');
    }

    public toDisplayEstimation(time: number): string {
        const skulls = Math.floor(time / this.estimationBase);
        const minutes = Math.ceil(time / 1000 / 60);

        return `${skulls} Skull${skulls > 1 ? 's' : ''} (${minutes} minute${minutes > 1 ? 's' : ''})`;
    }
}
</script>

<style lang="scss" scoped>
.task-editor-container {

    .placeholder-panel {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;

        .placeholder-text {
            color: rgb(255, 255, 255);
            background-color: rgba(63, 62, 68, 0.6);
            padding: 0.5em 0.75em;
        }
    }

    .task-view {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;

        .input-item, .edit-item, .day-selector {
            width: 85%;
        }

        .input-item {
            margin-top: 1.5em;
        }

        .edit-item {
            margin-top: 1.25em;
        }

        .task-name, .recur-content {
            color: rgb(255, 255, 255);
            background-color: rgba(63, 62, 68, 0.6);
        }

        .task-name {
            padding: 0.5em 1em;

            input {
                width: 100%;
                color: inherit;
                border: none;
                background-color: transparent;
                text-align: center;
                text-overflow: ellipsis;
                font-family: 'Segoe UI';
                font-size: 1.5em;
                outline: none;
            }
        }

        .recur-content {
            display: flex;
            align-items: center;
            padding: 0.5em 1.25em;

            span:first-of-type {
                width: 45%;
                font-family: 'Bruno Ace';
            }

            .checkbox {
                width: 55%;
                padding: 0.25em 0;
                font-size: 0.85em;
            }
        }

        .day-selector {
            margin-top: 1.5em;
            height: 2em;
        }

        .task-group {
            margin-top: 1.75em;
            width: 65%;
            height: 32%;
            max-height: 32%;
        }
    }
}
</style>
