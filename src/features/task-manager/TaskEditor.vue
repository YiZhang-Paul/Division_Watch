<template>
    <glass-panel class="task-editor-container">
        <div v-if="!task" class="placeholder-panel">
            <input-panel class="input-item">
                <div class="placeholder-text">No Task Selected.</div>
            </input-panel>
        </div>

        <overlay-scrollbar-panel v-if="task" class="task-view">
            <task-details-view class="task-view-content"
                :task="task"
                :childTasks="childTasks"
                @task:change="onTaskChange($event)"
                @task:update="onTaskUpdate($event)"
                @interruption:convert="convertInterruption($event)"
                @parent:add="addParentTask($event)"
                @parent:open="openParentTask($event)"
                @child:add="addChildTask($event)"
                @child:open="openTask($event)">
            </task-details-view>
        </overlay-scrollbar-panel>
    </glass-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../store';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item';
import { TaskItemList } from '../../core/enums/task-item-list.enum';
import InputPanel from '../../shared/panels/InputPanel.vue';
import GlassPanel from '../../shared/panels/GlassPanel.vue';
import OverlayScrollbarPanel from '../../shared/panels/OverlayScrollbarPanel.vue';

import TaskDetailsView from './TaskDetailsView.vue';

@Options({
    components: {
        InputPanel,
        GlassPanel,
        OverlayScrollbarPanel,
        TaskDetailsView
    }
})
export default class TaskEditor extends Vue {

    get task(): TaskItem | null {
        return store.getters['taskItem/activeTaskItem'];
    }

    get childTasks(): TaskItem[] {
        return this.task ? store.getters['taskItem/incompleteChildTasks'](this.task.id) : [];
    }

    public async addParentTask(task: TaskItem): Promise<void> {
        const added = await store.dispatch('taskItem/addParentTaskItem', task);

        if (added) {
            this.onTaskChange(added);
        }
    }

    public onTaskChange(task: TaskItem): void {
        store.commit('taskItem/setActiveTaskItem', task);
    }

    public onTaskUpdate(task: TaskItem): void {
        store.dispatch('taskItem/updateTaskItem', task);
    }

    public async addChildTask(name: string): Promise<void> {
        if (this.task) {
            const child: TaskItem = { ...new TaskItem(), name };
            const payload = { parentId: this.task.id, task: child };
            await store.dispatch('taskItem/addChildTaskItem', payload);
        }
    }

    public openParentTask(child: TaskItem): void {
        const parent = store.getters['taskItem/incompleteTask'](child?.parent ?? '');

        if (!parent) {
            throw new Error('Parent task not found.');
        }

        this.openTask(parent);
    }

    public openTask(task: TaskItem): void {
        store.dispatch('taskItem/swapActiveTaskItem', task);
    }

    public async convertInterruption(task: TaskItem): Promise<void> {
        const updated = await store.dispatch('taskItem/convertInterruption', task);

        if (updated) {
            store.commit('taskItem/setActiveTaskItem', updated);
            store.commit('taskItem/setActiveTaskItemList', TaskItemList.Tasks);
        }
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

    .task-view, .task-view-content {
        width: 100%;
        height: 100%;
    }
}
</style>
