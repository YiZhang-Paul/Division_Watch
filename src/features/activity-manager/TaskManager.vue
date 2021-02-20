<template>
    <div class="task-manager-container">
        <item-list-panel class="item-list-panel"
            @item:search="searchText = $event"
            @item:add="openEmptyTask()">

            <task-summary-card class="summary-card"
                v-for="task of tasks"
                :key="task.id"
                :task="task"
                :isActive="task.id === activeTask?.id || task.id === activeTask?.parent"
                @click="onTaskSelected(task)">
            </task-summary-card>

            <placeholder-panel v-if="!tasks.length"
                class="placeholder-panel"
                :text="searchText ? 'no matching entry found.' : 'no entry created yet.'">
            </placeholder-panel>
        </item-list-panel>

        <div v-if="!activeTask" class="placeholder-wrapper">
            <placeholder-panel class="placeholder-panel" :text="'no entry selected.'"></placeholder-panel>
        </div>

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
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { ArrowLeftCircle } from 'mdue';

import store from '../../store';
import { dialogKey } from '../../store/dialog/dialog.state';
import { taskItemKey } from '../../store/task-item/task-item.state';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
import { DialogOption } from '../../core/data-model/generic/dialog-option';
import ItemListPanel from '../../shared/panels/ItemListPanel.vue';
import PlaceholderPanel from '../../shared/panels/PlaceholderPanel.vue';
import TaskSummaryCard from '../../shared/cards/TaskSummaryCard.vue';

import TaskEditor from './editors/TaskEditor.vue';

class TaskManagerProp {
    public isInterruption = prop<boolean>({ default: false });
}

@Options({
    components: {
        ArrowLeftCircle,
        ItemListPanel,
        PlaceholderPanel,
        TaskSummaryCard,
        TaskEditor
    }
})
export default class TaskManager extends Vue.with(TaskManagerProp) {
    public searchText = '';
    private updateDebounceTimer: NodeJS.Timeout | null = null;

    get tasks(): TaskItem[] {
        const getter = this.isInterruption ? 'incompleteInterruptions' : 'incompleteParentTasks';
        const tasks: TaskItem[] = store.getters[`${taskItemKey}/${getter}`];

        return tasks.filter(_ => _.name.toLowerCase().includes(this.searchText));
    }

    get activeTask(): TaskItem | null {
        const getter = this.isInterruption ? 'activeInterruption' : 'activeItem';

        return store.getters[`${taskItemKey}/${getter}`];
    }

    get activeParentTask(): TaskItem | null {
        if (this.isInterruption) {
            return null;
        }

        return store.getters[`${taskItemKey}/incompleteItem`](this.activeTask?.parent ?? '');
    }

    get activeChildTasks(): TaskItem[] {
        if (this.isInterruption || !this.activeTask) {
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
        const task = await store.dispatch(`${taskItemKey}/getEmptyTaskItem`, this.isInterruption);

        if (task) {
            this.onTaskSelected(task);
        }
    }

    public onTaskSelected(task: TaskItem | null): void {
        if (!this.activeTask || task?.id !== this.activeTask.id) {
            const action = this.isInterruption ? 'swapActiveInterruption' : 'swapActiveItem';
            store.dispatch(`${taskItemKey}/${action}`, task);
        }
    }

    public onTaskChange(task: TaskItem): void {
        const mutation = this.isInterruption ? 'setActiveInterruption' : 'setActiveItem';
        store.commit(`${taskItemKey}/${mutation}`, task);

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

    public onTaskDelete(task: TaskItem): void {
        const title = 'This item will be permanently deleted.';
        const checkboxText = task.parent || task.isInterruption ? '' : 'do not remove child tasks';
        const option = new DialogOption(title, 'Delete', 'Cancel', checkboxText, null, true);

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
    $content-width: 92.5%;

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

        .placeholder-panel {
            margin-left: 2.5%;
            width: 95%;
        }
    }

    .placeholder-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        width: calc(100% - #{$list-width});
        height: 100%;

        .placeholder-panel {
            width: 35%;
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 1.5vh;
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
            animation: revealContent 0.3s ease 0.5s forwards;

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
    }
}
</style>
