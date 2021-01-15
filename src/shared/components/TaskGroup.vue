<template>
    <div ref="containerArea"
        class="task-group-container"
        :style="{ '--container-height': containerHeight + 'px', '--group-base-delay': delay + 's' }">

        <span>{{ name }}</span>

        <div class="group-area">
            <div class="side-guard">
                <div></div>
                <div></div>
                <div></div>
            </div>

            <overlay-scrollbar-panel v-if="tasks.length"
                class="summary-cards"
                :style="{ 'animation-delay': isLoaded ? '0' : delay + 0.5 + 's' }">

                <task-summary-card v-for="task of tasks"
                    :key="task.name"
                    class="summary-card"
                    :task="task"
                    :style="{ 'animation-delay': isLoaded ? '0' : delay + 0.5 + 's' }"
                    @click="$emit('task:select', task)">
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
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item';
import TaskSummaryCard from '../cards/TaskSummaryCard.vue';
import InputPanel from '../panels/InputPanel.vue';
import OverlayScrollbarPanel from '../panels/OverlayScrollbarPanel.vue';

class TaskGroupProp {
    public name = prop<string>({ default: '' });
    public parent = prop<TaskItem>({ default: null });
    public tasks = prop<TaskItem[]>({ default: [] });
    public delay = prop<number>({ default: 1.5 });
}

@Options({
    components: {
        CheckBold,
        TaskSummaryCard,
        InputPanel,
        OverlayScrollbarPanel
    },
    emits: [
        'task:add',
        'task:select'
    ]
})
export default class TaskGroup extends Vue.with(TaskGroupProp) {
    public isLoaded = false;
    public childTaskName = '';
    public containerHeight = 0;

    public mounted(): void {
        this.containerHeight = (this.$refs.containerArea as HTMLElement).offsetHeight;
        setTimeout(() => this.isLoaded = true, 2400);
    }

    public addChildTask(): void {
        if (this.childTaskName) {
            this.$emit('task:add', this.childTaskName);
            this.childTaskName = '';
        }
    }
}
</script>

<style lang="scss" scoped>
.task-group-container {
    $title-height: 1.5rem;
    $title-font-size: 0.5rem;
    $summary-card-height: 5vh;

    color: rgb(255, 255, 255);

    & > span:first-of-type {
        display: block;
        margin-left: 14%;
        width: 86%;
        height: $title-height;
        font-family: 'Bruno Ace';
        font-size: $title-font-size;
        opacity: 0;
        animation: revealContent 0.8s ease calc(var(--group-base-delay) + 0.1s) forwards;
    }

    .group-area {
        position: relative;
        margin-left: 10%;
        width: 90%;
        max-height: calc(100% - #{$title-height});
    }

    .summary-cards {
        $gap: 0.1rem;

        width: 100%;
        max-height: calc(var(--container-height) - #{$title-height} - #{$summary-card-height});
        opacity: 0;
        animation: revealContent 0.3s ease forwards;

        .summary-card {
            margin-bottom: $gap;
            width: 100%;
            height: calc(#{$summary-card-height} - #{$gap});
            opacity: 0;
            animation: revealContent 0.3s ease forwards;
        }
    }

    .divider {
        width: 100%;
        height: 0.125rem;
        background-color: rgb(246, 149, 78);
        opacity: 0;
        animation: revealContent 0.3s ease calc(var(--group-base-delay) + 0.6s) forwards;
    }

    .placeholder {
        margin-top: 0.075rem;
        width: 100%;
        height: calc(#{$summary-card-height} - 0.2rem);
        opacity: 0;
        animation: revealContent 0.3s ease calc(var(--group-base-delay) + 0.6s) forwards;
    }

    .placeholder-content {
        $side-padding: 5%;

        display: flex;
        align-items: center;
        padding: 0 $side-padding;
        width: calc(100% - #{$side-padding} * 2);
        height: 100%;
        background-color: rgba(63, 62, 68, 0.6);

        input {
            width: calc(100% - 1rem);
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
            font-size: 0.65rem;
            filter: brightness(0.7);
            transition: filter 0.3s;

            &:hover {
                cursor: pointer;
                filter: brightness(1);
            }
        }
    }

    .side-guard {
        $gap: 0.075rem;

        position: absolute;
        bottom: 0;
        left: calc(-100% / 9 + 0.15rem);
        width: calc(100% / 9);
        height: calc(100% + #{$title-height});

        div {
            position: absolute;
            background-color: rgb(255, 255, 255);
            opacity: 0;
        }

        div:first-of-type {
            top: calc(#{$title-font-size} / 2);
            left: calc(#{$gap} + (90% - 0.15rem) / 2);
            width: 0.1rem;
            height: 0.09rem;
            animation: blinkNormal 0.5s ease calc(var(--group-base-delay) + 0.1s) forwards,
                       extendTopGuard 0.3s ease calc(var(--group-base-delay) + 0.3s) forwards;
        }

        div:nth-of-type(2) {
            top: calc(#{$title-font-size} / 2 + 0.1rem + #{$gap});
            width: 0.04rem;
            height: calc(100% - #{$title-font-size} / 2 - 0.45rem - #{$gap} * 2);
            background-color: rgba(255, 255, 255, 0.45);
            animation: revealContent 0.3s ease calc(var(--group-base-delay) + 0.35s) forwards;
        }

        div:last-of-type {
            top: calc(100% - 0.35rem);
            left: $gap;
            width: 0;
            height: 0.1rem;
            animation: revealContent 0.02s ease calc(var(--group-base-delay) + 0.6s) forwards,
                       extendBottomGuard 0.4s ease calc(var(--group-base-delay) + 0.6s) forwards;
        }

        @keyframes extendTopGuard {
            from {
                left: calc(#{$gap} + (90% - 0.15rem) / 2);
                width: 0.025rem;
            }
            to {
                left: $gap;
                width: 90%;
            }
        }

        @keyframes extendBottomGuard {
            from {
                width: 0;
            }
            to {
                width: 35%;
            }
        }
    }
}
</style>
