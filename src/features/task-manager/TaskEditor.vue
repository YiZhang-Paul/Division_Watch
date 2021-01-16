<template>
    <glass-panel class="task-editor-container">
        <div v-if="!task" class="placeholder-panel">
            <input-panel class="input-item">
                <div class="placeholder-text">No Task Selected.</div>
            </input-panel>
        </div>

        <div v-if="task" class="task-view">
            <input-panel class="input-item" :delay="0.3">
                <div class="task-name">
                    <arrow-left-circle v-if="task.parent"
                        class="back-button"
                        @click="openParentTask()" />

                    <cloud-upload v-if="!task.id"
                        class="save-button"
                        @click="addParentTask()" />

                    <input type="text"
                        :value="task.name"
                        @input="setActiveTaskItemField('name', $event.target.value)"
                        placeholder="enter task name here..." />
                </div>
            </input-panel>

            <option-dropdown class="edit-item"
                :name="'Category'"
                :selected="task.category"
                :options="taskOptions.categories"
                :transform="_ => _.name"
                :delay="0.3"
                @options:select="setActiveTaskItemField('category', $event)">
            </option-dropdown>

            <option-dropdown class="edit-item"
                :name="'Priority'"
                :selected="task.priority"
                :options="taskOptions.priorities"
                :transform="_ => _.name"
                :delay="0.3"
                @options:select="setActiveTaskItemField('priority', $event)">
            </option-dropdown>

            <option-dropdown class="edit-item"
                :name="'Deadline'"
                :selected="task.deadline"
                :options="taskOptions.deadlines"
                :transform="toDisplayDate"
                :delay="0.3"
                @options:select="setActiveTaskItemField('deadline', $event)">
            </option-dropdown>

            <option-dropdown class="edit-item"
                :name="'Estimate'"
                :selected="task.estimate"
                :disabled="childTasks.length"
                :disabledText="toDisplayEstimation(totalChildEstimation)"
                :options="taskOptions.estimates"
                :transform="toDisplayEstimation"
                :delay="0.3"
                @options:select="setActiveTaskItemField('estimate', $event)">
            </option-dropdown>

            <input-panel class="edit-item" :delay="0.3">
                <div class="recur-content">
                    <span>Recur</span>

                    <checkbox class="checkbox"
                        :name="'daily event'"
                        :checked="isDaily"
                        :disabled="task.parent"
                        @change="onDailyToggle($event)">
                    </checkbox>
                </div>
            </input-panel>

            <week-day-selector class="day-selector"
                :days="task.recur.slice()"
                :delay="0.7"
                :disabled="task.parent"
                @days:select="setActiveTaskItemField('recur', $event)">
            </week-day-selector>

            <task-group v-if="!task.parent"
                class="task-group"
                :name="'Subtasks'"
                :parent="task"
                :tasks="childTasks"
                :delay="0.5"
                :disabled="!task.id"
                @task:add="addChildTask($event)"
                @task:select="openTask($event)">
            </task-group>
        </div>
    </glass-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { ArrowLeftCircle, CloudUpload } from 'mdue';

import store from '../../store';
// eslint-disable-next-line no-unused-vars
import { Category } from '../../core/data-model/category';
// eslint-disable-next-line no-unused-vars
import { RankItem } from '../../core/data-model/rank-item';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item';
// eslint-disable-next-line no-unused-vars
import { TaskItemOptions } from '../../core/data-model/task-item-options';
import InputPanel from '../../shared/panels/InputPanel.vue';
import GlassPanel from '../../shared/panels/GlassPanel.vue';
import Checkbox from '../../shared/inputs/Checkbox.vue';
import OptionDropdown from '../../shared/inputs/OptionDropdown.vue';
import WeekDaySelector from '../../shared/inputs/WeekDaySelector.vue';
import TaskGroup from '../../shared/components/TaskGroup.vue';
import { TimeUtility } from '../../core/utilities/time/time.utility';

@Options({
    components: {
        ArrowLeftCircle,
        CloudUpload,
        InputPanel,
        GlassPanel,
        Checkbox,
        OptionDropdown,
        WeekDaySelector,
        TaskGroup
    }
})
export default class TaskEditor extends Vue {

    get task(): TaskItem | null {
        return store.getters['taskItem/activeTaskItem'];
    }

    get childTasks(): TaskItem[] {
        return this.task ? store.getters['taskItem/incompleteChildTasks'](this.task.id) : [];
    }

    get totalChildEstimation(): number {
        return this.childTasks.reduce((total, _) => total + _.estimate, 0);
    }

    get taskOptions(): TaskItemOptions {
        return store.getters['taskItem/taskItemOptions'];
    }

    get isDaily(): boolean {
        return !!this.task && this.task.recur.length === 7 && this.task.recur.every(_ => _);
    }

    public async created(): Promise<void> {
        const date = new Date().toISOString().replace(/T.*/g, '');
        await store.dispatch('taskItem/loadTaskItemOptions', date);
    }

    public onDailyToggle(isDaily: boolean): void {
        this.setActiveTaskItemField('recur', new Array(7).fill(isDaily));
    }

    public setActiveTaskItemField(key: string, value: any): void {
        store.commit('taskItem/setActiveTaskItem', { ...this.task, [key]: value });
    }

    public async addParentTask(): Promise<void> {
        const added = await store.dispatch('taskItem/addParentTaskItem', this.task);

        if (added) {
            store.commit('taskItem/setActiveTaskItem', added);
        }
    }

    public async addChildTask(name: string): Promise<void> {
        if (this.task) {
            const child: TaskItem = { ...new TaskItem(), name };
            const payload = { parentId: this.task.id, task: child };
            await store.dispatch('taskItem/addChildTaskItem', payload);
        }
    }

    public openParentTask(): void {
        const parent = store.getters['taskItem/incompleteTask'](this.task?.parent ?? '');

        if (!parent) {
            throw new Error('Parent task not found.');
        }

        this.openTask(parent);
    }

    public openTask(task: TaskItem): void {
        store.dispatch('taskItem/swapActiveTaskItem', task);
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
.task-editor-container {

    .placeholder-panel {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;

        .placeholder-text {
            padding: 0.2rem 0.6rem;
            color: rgb(255, 255, 255);
            background-color: rgba(63, 62, 68, 0.6);
            font-size: 0.5rem;
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
            margin-top: 4%;
        }

        .edit-item {
            margin-top: 2.5%;
        }

        .task-name, .recur-content {
            color: rgb(255, 255, 255);
            background-color: rgba(63, 62, 68, 0.6);
        }

        .task-name {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            padding: 1.5% 14%;

            .back-button, .save-button {
                position: absolute;
                left: calc(7% - 0.35rem);
                font-size: 0.7rem;
                filter: brightness(0.7);
                transition: filter 0.3s, color 0.3s;

                &:hover {
                    cursor: pointer;
                    filter: brightness(1);
                }
            }

            .save-button:hover {
                color: rgb(43, 219, 43);
            }

            input {
                width: 100%;
                color: inherit;
                border: none;
                background-color: transparent;
                text-align: center;
                text-overflow: ellipsis;
                font-family: 'Segoe UI';
                font-size: 0.65rem;
                outline: none;

                &:focus::placeholder {
                    color: transparent;
                }
            }
        }

        .recur-content {
            display: flex;
            align-items: center;
            padding: 1.5% 4%;

            span:first-of-type {
                width: 45%;
                font-family: 'Bruno Ace';
                font-size: 0.475rem;
            }

            .checkbox {
                width: 55%;
                padding: 0.25em 0 0.25em 0.25em;
                font-size: 0.4rem;
            }
        }

        .day-selector {
            margin-top: 2.5%;
            height: 1.5rem;
        }

        .task-group {
            margin-top: 4%;
            width: 65%;
            height: 35%;
            max-height: 35%;
        }
    }
}
</style>
