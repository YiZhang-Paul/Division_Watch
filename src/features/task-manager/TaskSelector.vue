<template>
    <glass-panel class="task-selector-container">
        <div class="task-selector-content">
            <task-list class="task-list"
                :isActive="activeButton === taskButton"
                :action="taskButton"
                :tasks="tasks"
                @activate="activeButton = taskButton">
            </task-list>

            <task-list class="task-list"
                :isActive="activeButton === interruptionButton"
                :action="interruptionButton"
                :tasks="interruptions"
                @activate="activeButton = interruptionButton">
            </task-list>

            <task-list class="task-list"
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
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item';
import { ActionButton } from '../../core/data-model/action-button';
import { TaskItemHttpService } from '../../core/services/http/task-item-http/task-item-http.service';
import InputPanel from '../../shared/panels/InputPanel.vue';
import GlassPanel from '../../shared/panels/GlassPanel.vue';
import TaskList from '../../shared/components/TaskList.vue';

const taskItemHttpService = new TaskItemHttpService();

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
    public tasks: TaskItem[] = [];
    public interruptions: TaskItem[] = [];

    public async created(): Promise<void> {
        const items = await taskItemHttpService.getTaskItems();
        this.tasks = items.filter(_ => !_.isInterruption);
        this.interruptions = items.filter(_ => _.isInterruption);
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
