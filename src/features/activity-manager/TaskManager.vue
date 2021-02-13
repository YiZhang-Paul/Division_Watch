<template>
    <div class="task-manager-container">
        <item-list-panel class="item-list-panel"
            @item:search="searchText = $event"
            @item:add="openEmptyTask()">

            <task-summary-card class="summary-card"
                v-for="task of tasks"
                :key="task.id"
                :task="task"
                :isActive="task.id === activeTask?.id"
                @click="onTaskSelected(task)">
            </task-summary-card>

            <placeholder-panel v-if="!tasks.length"
                :text="searchText ? 'no matching task found.' : 'no task created yet.'">
            </placeholder-panel>
        </item-list-panel>

        <div v-if="activeTask" class="content">
            <div v-if="activeTask.parent" class="parent-link" @click="onTaskSelected(activeParentTask)">
                <arrow-left-circle class="back-button" />
                <span>parent - {{ activeParentTask.name }}</span>
            </div>

            <task-editor class="task-editor"
                :task="activeTask"
                :childTasks="activeChildTasks"
                @task:change="onTaskChange($event)"
                @child:add="addChildTask($event)"
                @child:open="onTaskSelected($event)"
                @child:delete="onTaskDelete($event)">
            </task-editor>

            <actions-group v-if="!activeTask.id"
                class="actions-group"
                :name="'Actions'"
                :actions="emptyTaskActions"
                @action:selected="onActionSelected($event)">
            </actions-group>

            <actions-group v-if="activeTask.id"
                class="actions-group"
                :name="'Danger Zone'"
                :actions="activeTask.parent ? childDangerZoneActions : parentDangerZoneActions"
                :isWarning="true"
                @action:selected="onActionSelected($event)">
            </actions-group>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { ArrowLeftCircle } from 'mdue';

import store from '../../store';
import { dialogKey } from '../../store/dialog/dialog.state';
import { taskItemKey } from '../../store/task-item/task-item.state';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
import { BasicAction } from '../../core/data-model/generic/basic-action';
import { DialogOption } from '../../core/data-model/generic/dialog-option';
import ItemListPanel from '../../shared/panels/ItemListPanel.vue';
import PlaceholderPanel from '../../shared/panels/PlaceholderPanel.vue';
import ActionsGroup from '../../shared/controls/ActionsGroup.vue';
import TaskSummaryCard from '../../shared/cards/TaskSummaryCard.vue';
import { TaskAction } from '../../core/enums/task-action.enum';

import TaskEditor from './TaskEditor.vue';

@Options({
    components: {
        ArrowLeftCircle,
        ItemListPanel,
        PlaceholderPanel,
        ActionsGroup,
        TaskSummaryCard,
        TaskEditor
    }
})
export default class TaskManager extends Vue {
    public readonly emptyTaskActions = [new BasicAction('Create Task', TaskAction.Create)];
    public readonly parentDangerZoneActions = [new BasicAction('Delete Task', TaskAction.Delete, true)];

    public readonly childDangerZoneActions = [
        new BasicAction('Convert to Parent', TaskAction.ConvertToParent),
        ...this.parentDangerZoneActions
    ];

    public searchText = '';
    private updateDebounceTimer: NodeJS.Timeout | null = null;

    get tasks(): TaskItem[] {
        const tasks: TaskItem[] = store.getters[`${taskItemKey}/incompleteParentTasks`];

        return tasks.filter(_ => _.name.toLowerCase().includes(this.searchText));
    }

    get activeTask(): TaskItem | null {
        return store.getters[`${taskItemKey}/activeItem`];
    }

    get activeParentTask(): TaskItem | null {
        return store.getters[`${taskItemKey}/incompleteItem`](this.activeTask?.parent ?? '');
    }

    get activeChildTasks(): TaskItem[] {
        if (!this.activeTask) {
            return [];
        }

        return store.getters[`${taskItemKey}/incompleteChildTasksByParentId`](this.activeTask.id);
    }

    public beforeUnmount(): void {
        if (this.updateDebounceTimer) {
            store.dispatch(`${taskItemKey}/updateTaskItem`, this.activeTask);
        }
    }

    public async openEmptyTask(): Promise<void> {
        const task = await store.dispatch(`${taskItemKey}/getEmptyTaskItem`);

        if (task) {
            store.dispatch(`${taskItemKey}/swapActiveItem`, task);
        }
    }

    public onTaskSelected(task: TaskItem | null): void {
        store.dispatch(`${taskItemKey}/swapActiveItem`, task);
    }

    public onTaskChange(task: TaskItem): void {
        store.commit(`${taskItemKey}/setActiveItem`, task);

        if (!task.id) {
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

    public async addChildTask(task: TaskItem): Promise<void> {
        if (this.activeTask) {
            const payload = { parentId: this.activeTask.id, item: task };
            await store.dispatch(`${taskItemKey}/addChildTaskItem`, payload);
        }
    }

    public async onActionSelected(action: TaskAction): Promise<void> {
        if (action === TaskAction.Create) {
            const result = await store.dispatch(`${taskItemKey}/addParentTaskItem`, this.activeTask);

            if (result) {
                this.onTaskSelected(result);
            }
        }
        else if (action === TaskAction.ConvertToParent) {
            const title = 'This task will be converted to a parent task.';
            const option = new DialogOption(title, 'Convert', 'Cancel');

            option.confirmCallback = () => {
                store.dispatch(`${taskItemKey}/updateTaskItem`, { ...this.activeTask, parent: null });
            };

            store.dispatch(`${dialogKey}/openDialog`, option);
        }
        else if (action === TaskAction.Delete) {
            this.onTaskDelete(this.activeTask!);
        }
    }

    public onTaskDelete(task: TaskItem): void {
        const title = 'This task will be permanently deleted.';
        const checkboxText = 'keep child tasks';
        const option = new DialogOption(title, 'Delete', 'Cancel', checkboxText, true);

        option.confirmCallback = (keepChildren: boolean) => {
            store.dispatch(`${taskItemKey}/deleteTaskItem`, { item: task, keepChildren });
        };

        store.dispatch(`${dialogKey}/openDialog`, option);
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

    .content {
        $content-width: 92.5%;

        display: flex;
        flex-direction: column;
        align-items: center;
        width: calc(100% - #{$list-width});
        height: 100%;

        .parent-link {
            display: flex;
            align-items: center;
            align-self: flex-start;
            margin-left: calc((100% - #{$content-width}) / 2);
            margin-bottom: 1%;
            color: rgb(235, 235, 235);
            font-size: 0.625rem;
            opacity: 0;
            transition: color 0.3s;
            animation: revealContent 0.3s ease 1.2s forwards;

            &:hover {
                cursor: pointer;
                color: rgb(241, 165, 78);
            }

            .back-button {
                margin-right: 3px;
                font-size: 0.775rem;
            }
        }

        .task-editor {
            width: $content-width;
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
