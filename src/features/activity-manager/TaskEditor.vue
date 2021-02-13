<template>
    <div v-if="task" class="task-editor-container">
        <section-panel class="basic-information"
            :name="task.name"
            :isEditable="true"
            :placeholder="'enter task name here...'"
            @name:edited="onTaskChange('name', $event)">

            <option-dropdown v-if="!task.parent"
                class="editor-control"
                :name="'Category'"
                :selected="selectedCategory"
                :options="categories"
                :transform="_ => _.name"
                @options:select="onTaskChange('categoryId', $event.id)">
            </option-dropdown>

            <option-dropdown class="editor-control"
                :name="'Priority'"
                :selected="task.priority"
                :options="taskOptions.priorities"
                :transform="_ => _.name"
                @options:select="onTaskChange('priority', $event)">
            </option-dropdown>

            <option-dropdown class="editor-control"
                :name="'Deadline'"
                :selected="task.deadline"
                :options="taskOptions.deadlines"
                :transform="toDisplayDate"
                @options:select="onTaskChange('deadline', $event)">
            </option-dropdown>

            <option-dropdown class="editor-control"
                :name="'Estimate'"
                :selected="task.estimate"
                :options="taskOptions.estimates"
                :isDisabled="childTasks.length"
                :disableText="childTasksEstimation"
                :transform="toDisplayEstimation"
                @options:select="onTaskChange('estimate', $event)">
            </option-dropdown>

            <day-selector v-if="!task.parent"
                class="editor-control"
                :name="'Recur'"
                :days="task.recur.slice()"
                :isDisabled="task.parent"
                @days:select="onTaskChange('recur', $event)">
            </day-selector>
        </section-panel>

        <div class="subsections">
            <item-group-panel class="child-tasks"
                :name="'Subtasks (' + childTasks.length + ')'"
                :isDisabled="!task.id || task.parent"
                :placeholder="subtaskPlaceholder"
                @item:add="onChildTaskAdded($event)">

                <subtask-summary-card class="subtask-summary-card"
                    v-for="task of childTasks"
                    :key="task.id"
                    :task="task"
                    @click="$emit('child:open', task)"
                    @delete="$emit('child:delete', task)">
                </subtask-summary-card>
            </item-group-panel>

            <item-group-panel class="checklist-items"
                :name="checklistTitle"
                :placeholder="'add checklist here...'"
                @item:add="onChecklistAdded($event)">

                <draggable class="drag-wrapper"
                    v-model="task.checklist"
                    @start="drag = true"
                    @end="drag = false"
                    item-key="description">

                    <template #item="{ element }">
                        <checklist-card class="checklist-card"
                            :item="element"
                            @change="onChecklistChange(index, $event)"
                            @delete="onChecklistDelete(index)">
                        </checklist-card>
                    </template>
                </draggable>
            </item-group-panel>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import Draggable from 'vuedraggable';

import store from '../../store';
import { dialogKey } from '../../store/dialog/dialog.state';
import { categoryKey } from '../../store/category/category.state';
import { taskItemKey } from '../../store/task-item/task-item.state';
// eslint-disable-next-line no-unused-vars
import { Category } from '../../core/data-model/generic/category';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
// eslint-disable-next-line no-unused-vars
import { TaskItemOptions } from '../../core/data-model/task-item/task-item-options';
import { ChecklistItem } from '../../core/data-model/task-item/checklist-item';
import { DialogOption } from '../../core/data-model/generic/dialog-option';
import ItemGroupPanel from '../../shared/panels/ItemGroupPanel.vue';
import SectionPanel from '../../shared/panels/SectionPanel.vue';
import OptionDropdown from '../../shared/controls/OptionDropdown.vue';
import DaySelector from '../../shared/controls/DaySelector.vue';
import SubtaskSummaryCard from '../../shared/cards/SubtaskSummaryCard.vue';
import ChecklistCard from '../../shared/cards/ChecklistCard.vue';
import { TimeUtility } from '../../core/utilities/time/time.utility';
import { GenericUtility } from '../../core/utilities/generic/generic.utility';

class TaskEditorProp {
    public task = prop<TaskItem>({ default: null });
    public childTasks = prop<TaskItem[]>({ default: [] });
}

@Options({
    components: {
        Draggable,
        ItemGroupPanel,
        SectionPanel,
        OptionDropdown,
        DaySelector,
        SubtaskSummaryCard,
        ChecklistCard
    },
    emits: [
        'task:change',
        'child:add',
        'child:open',
        'child:delete'
    ]
})
export default class TaskEditor extends Vue.with(TaskEditorProp) {

    get subtaskPlaceholder(): string {
        if (this.task.parent) {
            return 'unavailable for child task.';
        }

        if (!this.task.id) {
            return 'must create parent task first.';
        }

        return 'add child task here...';
    }

    get selectedCategory(): Category {
        return store.getters[`${categoryKey}/category`](this.task?.categoryId);
    }

    get categories(): Category[] {
        return store.getters[`${categoryKey}/categories`];
    }

    get taskOptions(): TaskItemOptions {
        return store.getters[`${taskItemKey}/taskItemOptions`];
    }

    get childTasksEstimation(): string {
        const estimation = this.childTasks.reduce((total, _) => total + _.estimate, 0);

        return this.toDisplayEstimation(estimation);
    }

    get checklistTitle(): string {
        if (!this.task?.checklist) {
            return '';
        }

        const completed = this.task.checklist.filter(_ => _.isCompleted).length;

        return `Checklist (${completed}/${this.task.checklist.length})`;
    }

    public onChildTaskAdded(name: string): void {
        this.$emit('child:add', { ...new TaskItem(), name });
    }

    public onChecklistAdded(name: string): void {
        const checklist = this.task?.checklist ?? [];
        this.onTaskChange('checklist', [...checklist, new ChecklistItem(name)]);
    }

    public onChecklistChange(index: number, item: ChecklistItem): void {
        const checklist = this.task?.checklist ?? [];
        this.onTaskChange('checklist', GenericUtility.replaceAt(checklist, item, index));
    }

    public onChecklistDelete(index: number): void {
        const title = 'This item will be permanently deleted.';
        const option = new DialogOption(title, 'Delete', 'Cancel', '', true);

        option.confirmCallback = () => {
            const checklist = this.task?.checklist ?? [];
            this.onTaskChange('checklist', GenericUtility.removeAt(checklist, index), 200);
        };

        store.dispatch(`${dialogKey}/openDialog`, option);
    }

    public onTaskChange(key: string, value: any, delay = 0): void {
        setTimeout(() => this.$emit('task:change', { ...this.task, [key]: value }), delay);
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
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;

    .basic-information {
        width: 100%;

        .editor-control {
            width: 100%;
        }

        .editor-control:not(:nth-last-child(1)) {
            margin-bottom: 1%;
        }
    }

    .subsections {
        display: flex;
        justify-content: space-between;
        margin-top: 1.75%;
        width: 100%;
        height: 45%;

        .child-tasks, .checklist-items {
            width: 48.75%;
            height: 100%;
        }

        .drag-wrapper {
            width: 100%;
        }

        .subtask-summary-card, .checklist-card {
            width: 100%;
            height: 4.5vh;
            opacity: 0;
            animation: revealContent 0.3s ease 0.1s forwards;

            &:not(:nth-last-child(1)) {
                margin-bottom: 1%;
            }
        }
    }
}
</style>
