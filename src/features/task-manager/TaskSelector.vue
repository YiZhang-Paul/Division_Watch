<template>
    <glass-panel class="task-selector-container">
        <div class="task-selector-content">
            <task-list v-if="isLoaded"
                class="task-list"
                :isActive="activeButton === taskButton"
                :action="taskButton"
                :tasks="tasks"
                @activate="activeButton = taskButton"
                @summary:select="onSummarySelect($event)">
            </task-list>

            <task-list v-if="isLoaded"
                class="task-list"
                :isActive="activeButton === interruptionButton"
                :action="interruptionButton"
                :tasks="interruptions"
                @activate="activeButton = interruptionButton"
                @summary:select="onSummarySelect($event)">
            </task-list>

            <task-list v-if="isLoaded"
                class="task-list"
                :isActive="activeButton === categoryButton"
                :action="categoryButton"
                @activate="activeButton = categoryButton">
            </task-list>
        </div>
    </glass-panel>
</template>

<script lang="ts">
import { markRaw } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { ExclamationThick, FormatListBulletedType, Plus, TimerSand } from 'mdue';

import store from '../../store';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item';
import { ActionButton } from '../../core/data-model/action-button';
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
    public taskButton = new ActionButton('Tasks', markRaw(TimerSand), 'rgb(255, 28, 82)');
    public interruptionButton = new ActionButton('Interruptions', markRaw(ExclamationThick), 'rgb(0, 117, 255)');
    public categoryButton = new ActionButton('Categories', markRaw(FormatListBulletedType), 'rgb(245, 238, 58)');
    public activeButton = this.taskButton;
    public isLoaded = false;

    get tasks(): TaskItem[] {
        return store.getters['taskItem/tasks'];
    }

    get interruptions(): TaskItem[] {
        return store.getters['taskItem/interruptions'];
    }

    public created(): void {
        store.dispatch('taskItem/loadTaskItems');
    }

    public mounted(): void {
        setTimeout(() => this.isLoaded = true, 1500);
    }

    public onSummarySelect(task: TaskItem): void {
        store.commit('taskItem/setActiveTaskItem', null);
        setTimeout(() => store.commit('taskItem/setActiveTaskItem', task));
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
