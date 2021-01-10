<template>
    <div class="task-group-container">
        <span>{{ name }}</span>

        <div class="side-guard">
            <div></div>
            <div></div>
            <div></div>
        </div>

        <div class="group-area">
            <overlay-scrollbar-panel class="summary-cards">
                <task-summary-card v-for="task of tasks"
                    :key="task.name"
                    :task="task"
                    class="summary-card">
                </task-summary-card>
            </overlay-scrollbar-panel>

            <input-panel class="placeholder">
                <div class="placeholder-content"></div>
            </input-panel>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item';
import TaskSummaryCard from '../cards/TaskSummaryCard.vue';
import InputPanel from '../panels/InputPanel.vue';
import OverlayScrollbarPanel from '../panels/OverlayScrollbarPanel.vue';

class TaskGroupProp {
    public name = prop<string>({ default: '' });
    public tasks = prop<TaskItem[]>({ default: [] });
}

@Options({
    components: {
        TaskSummaryCard,
        InputPanel,
        OverlayScrollbarPanel
    }
})
export default class TaskGroup extends Vue.with(TaskGroupProp) { }
</script>

<style lang="scss" scoped>
.task-group-container {
    $title-height: 2.5em;

    position: relative;
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
        height: calc(100% - #{$title-height});
    }

    .summary-cards {
        width: 100%;
        height: calc(100% - (100% - 0.6em) / 4 - 0.2em);
        overflow-y: auto;

        .summary-card {
            margin-bottom: 0.2em;
            width: 100%;
            height: calc(100% / 3 - 0.2em);
        }
    }

    .placeholder {
        width: 100%;
        height: calc((100% - 0.6em) / 4);
    }

    .placeholder-content {
        width: 100%;
        height: 100%;
        background-color: rgba(63, 62, 68, 0.6)
    }

    .side-guard {
        $gap: 0.1em;

        position: absolute;
        top: 0;
        left: 3%;
        width: 8%;
        height: 100%;

        div {
            position: absolute;
            background-color: rgb(255, 255, 255);
        }

        div:first-of-type {
            top: 0.5em;
            left: $gap;
            width: 100%;
            height: 1%;
        }

        div:nth-of-type(2) {
            top: calc(1% + 0.5em + #{$gap});
            width: 0.75%;
            height: calc(99% - 1.2em - #{$gap} * 2);
        }

        div:last-of-type {
            top: calc(100% - 0.7em);
            left: $gap;
            width: 35%;
            height: 1%;
        }
    }
}
</style>
