<template>
    <glass-panel class="task-selector-container">
        <div class="task-selector-content">
            <task-list v-if="isLoaded"
                class="task-list"
                :isActive="activeButton === taskButton.name"
                :action="taskButton"
                :tasks="parentTasks"
                @activate="activeButton = taskButton.name"
                @task:add="openEmptyTask()"
                @summary:select="onSummarySelect($event)">
            </task-list>

            <task-list v-if="isLoaded"
                class="task-list"
                :isActive="activeButton === interruptionButton.name"
                :action="interruptionButton"
                :tasks="interruptions"
                @activate="activeButton = interruptionButton.name"
                @task:add="openEmptyTask(true)"
                @summary:select="onSummarySelect($event)">
            </task-list>

            <task-list v-if="isLoaded"
                class="task-list"
                :isActive="activeButton === categoryButton.name"
                :action="categoryButton"
                @activate="activeButton = categoryButton.name">
            </task-list>
        </div>
    </glass-panel>
</template>

<script lang="ts">
import { markRaw } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { ExclamationThick, FormatListBulletedType, Plus, TimerSand } from 'mdue';

import store from '../../store';
import { ActionButton } from '../../core/data-model/action-button';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item';
// eslint-disable-next-line no-unused-vars
import { TaskItemOptions } from '../../core/data-model/task-item-options';
import { TaskItemList } from '../../core/enums/task-item-list.enum';
import InputPanel from '../../shared/panels/InputPanel.vue';
import GlassPanel from '../../shared/panels/GlassPanel.vue';
import TaskList from '../../shared/components/TaskList.vue';

@Options({
    components: {
        ExclamationThick,
        Plus,
        TimerSand,
        InputPanel,
        GlassPanel,
        TaskList
    }
})
export default class TaskSelector extends Vue {
    public taskButton = new ActionButton(TaskItemList.Tasks, markRaw(TimerSand), 'rgb(255, 28, 82)');
    public interruptionButton = new ActionButton(TaskItemList.Interruptions, markRaw(ExclamationThick), 'rgb(0, 117, 255)');
    public categoryButton = new ActionButton(TaskItemList.Categories, markRaw(FormatListBulletedType), 'rgb(245, 238, 58)');
    public isLoaded = false;

    get parentTasks(): TaskItem[] {
        return store.getters['taskItem/incompleteParentTasks'];
    }

    get interruptions(): TaskItem[] {
        return store.getters['taskItem/incompleteInterruptions'];
    }

    get activeButton(): string {
        return store.getters['taskItem/activeTaskItemList'];
    }

    set activeButton(name: string) {
        store.commit('taskItem/setActiveTaskItemList', name);
    }

    public created(): void {
        store.dispatch('taskItem/loadIncompleteTaskItems');
    }

    public mounted(): void {
        setTimeout(() => this.isLoaded = true, 1500);
    }

    public async openEmptyTask(isInterruption = false): Promise<void> {
        const task: TaskItem = await store.dispatch('taskItem/getEmptyTaskItem');
        task.isInterruption = isInterruption;
        store.commit('taskItem/setActiveTaskItem', null);
        setTimeout(() => store.commit('taskItem/setActiveTaskItem', task));
    }

    public onSummarySelect(task: TaskItem): void {
        if (store.getters['taskItem/activeTaskItem']?.id !== task.id) {
            store.commit('taskItem/setActiveTaskItem', null);
            setTimeout(() => store.commit('taskItem/setActiveTaskItem', task));
        }
    }
}
</script>

<style lang="scss" scoped>
.task-selector-container {

    .task-selector-content {
        display: flex;
        flex-direction: column;
        padding-top: 5px;
        width: 100%;
        height: calc(100% - 5px);
    }

    ::v-deep .task-list {
        margin-top: 2px;
        width: 100%;
        height: 7%;
        max-height: 50px;
    }
}
</style>
