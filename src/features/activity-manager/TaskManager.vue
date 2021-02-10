<template>
    <div class="task-manager-container">
        <item-list-panel class="item-list-panel" @search="searchText = $event">
            <task-summary-card class="summary-card"
                v-for="task of tasks"
                :key="task.id"
                :task="task"
                :isActive="task.id === activeTask?.id"
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
                <item-group-panel class="child-tasks"
                    :name="'Subtasks (' + activeChildTasks.length + ')'"
                    :placeholder="'add child task here...'"
                    @item:add="addChildTask($event)">

                    <subtask-summary-card class="subtask-summary-card"
                        v-for="task of activeChildTasks"
                        :key="task.id"
                        :task="task">
                    </subtask-summary-card>
                </item-group-panel>

                <item-group-panel class="checklist-items"
                    :name="checklistTitle"
                    :placeholder="'add checklist here...'"
                    @item:add="addChecklistItem($event)">

                    <checklist-card class="checklist-card"
                        v-for="(item, index) of activeTask.checklist"
                        :key="item.description"
                        :item="item"
                        @change="onChecklistChange(index, $event)"
                        @delete="onChecklistDelete(index)">
                    </checklist-card>
                </item-group-panel>
            </div>

            <actions-group class="actions-group"
                :name="'Danger Zone'"
                :actions="dangerZoneActions"
                :isWarning="true"
                @action:selected="onActionSelected($event)">
            </actions-group>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../store';
import { dialogKey } from '../../store/dialog/dialog.state';
import { categoryKey } from '../../store/category/category.state';
import { taskItemKey } from '../../store/task-item/task-item.state';
import { Category } from '../../core/data-model/generic/category';
import { ChecklistItem } from '../../core/data-model/task-item/checklist-item';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
// eslint-disable-next-line no-unused-vars
import { TaskItemOptions } from '../../core/data-model/task-item/task-item-options';
import { BasicAction } from '../../core/data-model/generic/basic-action';
import { DialogOption } from '../../core/data-model/generic/dialog-option';
import ItemListPanel from '../../shared/panels/ItemListPanel.vue';
import SectionPanel from '../../shared/panels/SectionPanel.vue';
import ItemGroupPanel from '../../shared/panels/ItemGroupPanel.vue';
import ActionsGroup from '../../shared/controls/ActionsGroup.vue';
import OptionDropdown from '../../shared/controls/OptionDropdown.vue';
import DaySelector from '../../shared/controls/DaySelector.vue';
import TaskSummaryCard from '../../shared/cards/TaskSummaryCard.vue';
import SubtaskSummaryCard from '../../shared/cards/SubtaskSummaryCard.vue';
import ChecklistCard from '../../shared/cards/ChecklistCard.vue';
import { TaskAction } from '../../core/enums/task-action.enum';
import { TimeUtility } from '../../core/utilities/time/time.utility';
import { GenericUtility } from '../../core/utilities/generic/generic.utility';

@Options({
    components: {
        ItemListPanel,
        SectionPanel,
        ItemGroupPanel,
        ActionsGroup,
        OptionDropdown,
        DaySelector,
        TaskSummaryCard,
        SubtaskSummaryCard,
        ChecklistCard
    }
})
export default class TaskManager extends Vue {
    public readonly dangerZoneActions = [new BasicAction('Delete Task', TaskAction.Delete, true)];
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

    get checklistTitle(): string {
        if (!this.activeTask?.checklist) {
            return '';
        }

        const { checklist } = this.activeTask;
        const completed = checklist.filter(_ => _.isCompleted).length;

        return `Checklist (${completed}/${checklist.length})`;
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

    public onTaskSelected(task: TaskItem): void {
        store.dispatch(`${taskItemKey}/swapActiveItem`, task);
    }

    public onItemChange(key: string, value: any, delay = 0): void {
        const changed = { ...this.activeTask!, [key]: value };
        setTimeout(() => store.commit(`${taskItemKey}/setActiveItem`, changed), delay);

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

    public onChecklistChange(index: number, item: ChecklistItem): void {
        const checklist = this.activeTask?.checklist ?? [];
        this.onItemChange('checklist', GenericUtility.replaceAt(checklist, item, index));
    }

    public onChecklistDelete(index: number): void {
        const title = 'This item will be permanently deleted.';
        const option = new DialogOption(title, 'Delete', 'Cancel', true);

        option.confirmCallback = () => {
            const checklist = this.activeTask?.checklist ?? [];
            this.onItemChange('checklist', GenericUtility.removeAt(checklist, index), 200);
        };

        store.dispatch(`${dialogKey}/openDialog`, option);
    }

    public onActionSelected(action: TaskAction): void {
        if (action === TaskAction.Delete) {
            const title = 'This task will be permanently deleted.';
            const option = new DialogOption(title, 'Delete', 'Cancel', true);

            option.confirmCallback = () => {
                store.dispatch(`${taskItemKey}/deleteTaskItem`, { item: this.activeTask });
            };

            store.dispatch(`${dialogKey}/openDialog`, option);
        }
    }

    public async addChildTask(name: string): Promise<void> {
        if (this.activeTask) {
            const child: TaskItem = { ...new TaskItem(), name };
            const payload = { parentId: this.activeTask.id, task: child };
            await store.dispatch(`${taskItemKey}/addChildTaskItem`, payload);
        }
    }

    public addChecklistItem(name: string): void {
        if (this.activeTask) {
            this.activeTask.checklist.push(new ChecklistItem(name));
            store.dispatch(`${taskItemKey}/updateTaskItem`, this.activeTask);
        }
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
    $list-width: 29%;

    .item-list-panel {
        width: $list-width;
        height: 97.5%;

        .summary-card {
            width: 100%;
            height: 10.5vh;
            opacity: 0;
            animation: revealContent 0.3s ease 0.1s forwards;

            &:not(:nth-last-child(1)) {
                margin-bottom: 0.9vh;
            }
        }
    }

    .editor-area {
        $content-width: 92.5%;

        display: flex;
        flex-direction: column;
        align-items: center;
        width: calc(100% - #{$list-width});
        height: 100%;

        .basic-information {
            width: $content-width;
            height: 42%;

            .editor-control {
                width: 100%;
            }
        }

        .subsections {
            display: flex;
            justify-content: space-between;
            margin-top: 1.75%;
            width: $content-width;
            height: 39.5%;

            .child-tasks, .checklist-items {
                width: 48.75%;
                height: 100%;
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

        .actions-group {
            $margin-left: 0.75rem;

            margin-top: auto;
            margin-left: $margin-left;
            width: calc(#{$content-width} - #{$margin-left});
            opacity: 0;
            animation: revealContent 0.3s ease 1.2s forwards;
        }
    }
}
</style>
