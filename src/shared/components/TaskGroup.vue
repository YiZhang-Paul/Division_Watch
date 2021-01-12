<template>
    <div ref="containerArea"
        class="task-group-container"
        :style="{ '--container-height': containerHeight + 'px' }">

        <span>{{ name }}</span>

        <div class="group-area">
            <div class="side-guard">
                <div></div>
                <div></div>
                <div></div>
            </div>

            <overlay-scrollbar-panel v-if="tasks.length" class="summary-cards">
                <task-summary-card v-for="task of tasks"
                    :key="task.name"
                    :task="task"
                    class="summary-card">
                </task-summary-card>
            </overlay-scrollbar-panel>

            <div class="divider"></div>

            <input-panel v-if="parent" class="placeholder" :hasAnimation="false">
                <div class="placeholder-content">
                    <input type="text"
                        v-model="childTaskName"
                        placeholder="add child task here..."
                        @keyup.enter="addChildTask()" />

                    <check-bold v-if="childTaskName" class="add-child-task" @click="addChildTask()" />
                </div>
            </input-panel>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { CheckBold } from 'mdue';

import store from '../../store';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item';
import TaskSummaryCard from '../cards/TaskSummaryCard.vue';
import InputPanel from '../panels/InputPanel.vue';
import OverlayScrollbarPanel from '../panels/OverlayScrollbarPanel.vue';

class TaskGroupProp {
    public name = prop<string>({ default: '' });
    public parent = prop<TaskItem>({ default: null });
    public tasks = prop<TaskItem[]>({ default: [] });
}

@Options({
    components: {
        CheckBold,
        TaskSummaryCard,
        InputPanel,
        OverlayScrollbarPanel
    }
})
export default class TaskGroup extends Vue.with(TaskGroupProp) {
    public childTaskName = '';
    public containerHeight = 0;

    public mounted(): void {
        this.containerHeight = (this.$refs.containerArea as HTMLElement).offsetHeight;
    }

    public async addChildTask(): Promise<void> {
        if (!this.childTaskName) {
            return;
        }

        const task: TaskItem = { ...new TaskItem(), name: this.childTaskName };
        await store.dispatch('taskItem/addChildTaskItem', { parentId: this.parent.id, task });
        this.childTaskName = '';
    }
}
</script>

<style lang="scss" scoped>
.task-group-container {
    $title-height: 2.5em;
    $summary-card-height: 4.5vh;

    color: rgb(255, 255, 255);

    & > span:first-of-type {
        display: block;
        margin-left: 14%;
        width: 86%;
        height: $title-height;
        font-family: 'Bruno Ace';
    }

    .group-area {
        position: relative;
        margin-left: 10%;
        width: 90%;
        max-height: calc(100% - #{$title-height});
    }

    .summary-cards {
        $gap: 0.2em;

        width: 100%;
        max-height: calc(var(--container-height) - #{$title-height} - #{$summary-card-height});

        .summary-card {
            margin-bottom: $gap;
            width: 100%;
            height: calc(#{$summary-card-height} - #{$gap});
        }
    }

    .divider {
        width: 100%;
        height: 0.25em;
        background-color: rgb(246, 149, 78);
    }

    .placeholder {
        margin-top: 0.15em;
        width: 100%;
        height: calc(#{$summary-card-height} - 0.4em);
    }

    .placeholder-content {
        $side-padding: 1em;

        display: flex;
        align-items: center;
        padding: 0 $side-padding;
        width: calc(100% - #{$side-padding} * 2);
        height: 100%;
        background-color: rgba(63, 62, 68, 0.6);

        input {
            width: calc(100% - 2em);
            border: none;
            color: rgb(255, 255, 255);
            background-color: transparent;
            text-overflow: ellipsis;
            font-family: 'Segoe UI';
            outline: none;
        }

        .add-child-task {
            position: absolute;
            right: $side-padding;
            color: rgb(21, 200, 39);
            filter: brightness(0.7);
            transition: filter 0.3s;

            &:hover {
                cursor: pointer;
                filter: brightness(1);
            }
        }
    }

    .side-guard {
        $gap: 0.1em;

        position: absolute;
        bottom: 0;
        left: calc(-100% / 9 + 0.25em);
        width: calc(100% / 9);
        height: calc(100% + #{$title-height});

        div {
            position: absolute;
            background-color: rgb(255, 255, 255);
        }

        div:first-of-type {
            top: 0.5em;
            left: $gap;
            width: 90%;
            height: 0.15em;
        }

        div:nth-of-type(2) {
            top: calc(1% + 0.5em + #{$gap});
            width: 0.05em;
            height: calc(99% - 1.2em - #{$gap} * 2);
            background-color: rgba(255, 255, 255, 0.45);
        }

        div:last-of-type {
            top: calc(100% - 0.7em);
            left: $gap;
            width: 35%;
            height: 0.15em;
        }
    }
}
</style>
