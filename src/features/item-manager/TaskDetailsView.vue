<template>
    <div class="task-details-view-container">
        <input-panel class="input-item" :delay="0.3">
            <div class="task-name">
                <arrow-left-circle v-if="task.parent"
                    class="back-button"
                    @click="$emit('parent:open', task)" />

                <cloud-upload v-if="!task.id"
                    class="save-button"
                    @click="$emit('parent:add', task)" />

                <input type="text"
                    :value="task.name"
                    @input="onTaskItemChange('name', $event.target.value)"
                    placeholder="enter name here..." />
            </div>
        </input-panel>

        <option-dropdown class="edit-item"
            :name="'Category'"
            :selected="task.category"
            :options="taskOptions.categories"
            :transform="_ => _.name"
            :delay="0.3"
            @options:select="onTaskItemChange('categoryId', $event.id)">
        </option-dropdown>

        <option-dropdown class="edit-item"
            :name="'Priority'"
            :selected="task.priority"
            :options="taskOptions.priorities"
            :transform="_ => _.name"
            :delay="0.3"
            @options:select="onTaskItemChange('priority', $event)">
        </option-dropdown>

        <option-dropdown class="edit-item"
            :name="'Deadline'"
            :selected="task.deadline"
            :options="taskOptions.deadlines"
            :transform="toDisplayDate"
            :delay="0.3"
            @options:select="onTaskItemChange('deadline', $event)">
        </option-dropdown>

        <option-dropdown class="edit-item"
            :name="'Estimate'"
            :selected="task.estimate"
            :disabled="childTasks.length"
            :disabledText="toDisplayEstimation(totalChildEstimation)"
            :options="taskOptions.estimates"
            :transform="toDisplayEstimation"
            :delay="0.3"
            @options:select="onTaskItemChange('estimate', $event)">
        </option-dropdown>

        <template v-if="!task.isInterruption">
            <input-panel class="edit-item" :delay="0.3">
                <div class="recur-content">
                    <span>Recur</span>

                    <checkbox class="checkbox"
                        :name="'daily event'"
                        :checked="isDaily"
                        :disabled="task.parent"
                        @update:checked="onDailyToggle($event)">
                    </checkbox>
                </div>
            </input-panel>

            <week-day-selector class="day-selector"
                :days="task.recur.slice()"
                :delay="0.7"
                :disabled="task.parent"
                @days:select="onTaskItemChange('recur', $event)">
            </week-day-selector>
        </template>

        <task-group v-if="!task.parent"
            class="task-group"
            :class="{ 'disabled-group': !allowChildTask }"
            :name="'Subtasks'"
            :parent="task"
            :tasks="childTasks"
            :delay="0.5"
            :disabled="!allowChildTask"
            :disabledText="task.isInterruption ? 'unavailable until conversion.' : 'parent task not created yet.'"
            @task:add="$emit('child:add', $event)"
            @task:select="$emit('child:open', $event)"
            @task:delete="$emit('task:delete', { taskItem: $event, keepChildren: null })">
        </task-group>

        <task-danger-zone v-if="task.id"
            class="edit-item danger-zone"
            :isParent="childTasks.length"
            :isInterruption="task.isInterruption"
            @interruption:convert="$emit('interruption:convert', task)"
            @task:delete="$emit('task:delete', { taskItem: task, keepChildren: $event })">
        </task-danger-zone>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { ArrowLeftCircle, CloudUpload } from 'mdue';

import store from '../../store';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item';
// eslint-disable-next-line no-unused-vars
import { TaskItemOptions } from '../../core/data-model/task-item-options';
import InputPanel from '../../shared/panels/InputPanel.vue';
import ConfirmPanel from '../../shared/panels/ConfirmPanel.vue';
import Checkbox from '../../shared/inputs/Checkbox.vue';
import OptionDropdown from '../../shared/inputs/OptionDropdown.vue';
import WeekDaySelector from '../../shared/inputs/WeekDaySelector.vue';
import TaskGroup from '../../shared/components/TaskGroup.vue';
import { TimeUtility } from '../../core/utilities/time/time.utility';

import TaskDangerZone from './TaskDangerZone.vue';

class TaskDetailsViewProp {
    public task = prop<TaskItem>({ default: null });
    public childTasks = prop<TaskItem[]>({ default: [] });
}

@Options({
    components: {
        ArrowLeftCircle,
        CloudUpload,
        InputPanel,
        ConfirmPanel,
        Checkbox,
        OptionDropdown,
        WeekDaySelector,
        TaskGroup,
        TaskDangerZone
    },
    emits: [
        'task:change',
        'task:update',
        'task:delete',
        'interruption:convert',
        'parent:add',
        'parent:open',
        'child:add',
        'child:open'
    ]
})
export default class TaskDetailsView extends Vue.with(TaskDetailsViewProp) {
    private updateDebounceTimer: NodeJS.Timeout | null = null;

    get totalChildEstimation(): number {
        return this.childTasks.reduce((total, _) => total + _.estimate, 0);
    }

    get taskOptions(): TaskItemOptions {
        return store.getters['taskItem/taskItemOptions'];
    }

    get isDaily(): boolean {
        return !!this.task && this.task.recur.length === 7 && this.task.recur.every(_ => _);
    }

    get allowChildTask(): boolean {
        return Boolean(this.task.id) && !this.task.isInterruption;
    }

    public beforeUnmount(): void {
        if (this.updateDebounceTimer) {
            this.$emit('task:update', this.task);
        }
    }

    public onDailyToggle(isDaily: boolean): void {
        this.onTaskItemChange('recur', new Array(7).fill(isDaily));
    }

    public onTaskItemChange(key: string, value: any): void {
        this.$emit('task:change', { ...this.task, [key]: value });

        if (this.updateDebounceTimer) {
            clearTimeout(this.updateDebounceTimer);
        }

        this.updateDebounceTimer = setTimeout(() => {
            this.$emit('task:update', this.task);
            this.updateDebounceTimer = null;
        }, 1000);
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
.task-details-view-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;

    .input-item, .edit-item, .day-selector {
        width: 85%;
    }

    .input-item {
        margin-top: 3%;
    }

    .edit-item {
        margin-top: 2%;
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
            padding: 0.25em 0 0.25em 1.75em;
            font-size: 0.4rem;
        }
    }

    .day-selector {
        margin-top: 2.5%;
        height: 1.5rem;
    }

    .task-group {
        margin-top: 3%;
        margin-bottom: 3%;
        width: 65%;
        height: 32.5%;
        max-height: 32.5%;
    }

    .disabled-group {
        margin-top: 8%;
        height: 20%;
        max-height: 20%;
    }

    .danger-zone {
        margin-top: auto;
        margin-bottom: 6%;
    }
}
</style>
