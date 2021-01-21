<template>
    <div v-if="task" class="task-summary-card-container" :style="containerStyle">
        <div class="card-content">
            <template v-if="!task.parent">
                <div v-if="!task.category.icon"
                    class="default-category-icon"
                    :style="{ 'background-color': task.category.color }">
                </div>

                <rotate-3d-variant v-if="isRecur" class="icon-indicator" />
            </template>

            <span :class="{ 'child-task-name': task.parent }" :style="taskNameStyle">{{ task.name }}</span>

            <div v-if="skulls >= 1" class="skulls">
                <img v-for="(skull, index) in skulls"
                    :key="skull"
                    :style="getSkullStyle(index)"
                    src="../../assets/images/rogue_skull.png" />
            </div>

            <div v-if="skulls < 1" class="skulls half-skull">
                <div><img src="../../assets/images/rogue_skull.png" /></div>
                <div><img src="../../assets/images/rogue_skull.png" /></div>
            </div>
        </div>

        <div v-if="task.parent" class="card-actions" @click.stop="$emit('delete')">
            <close class="close-icon" />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { Close, Rotate_3dVariant } from 'mdue';

import store from '../../store';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item';
// eslint-disable-next-line no-unused-vars
import { TaskItemOptions } from '../../core/data-model/task-item-options';

class TaskSummaryCardProp {
    public task = prop<TaskItem>({ default: null });
}

@Options({
    components: {
        Close,
        Rotate3dVariant: Rotate_3dVariant
    },
    emits: ['delete']
})
export default class TaskSummaryCard extends Vue.with(TaskSummaryCardProp) {
    private readonly skullSpacing = 0.25;

    get containerStyle(): { [key: string]: string } {
        return { 'background-color': `rgba(${this.baseColor}, 0.5)` };
    }

    get baseColor(): string {
        if (!this.task.priority.rank) {
            return '73, 207, 73';
        }

        return this.task.priority.rank === 1 ? '238, 171, 70' : '231, 72, 72';
    }

    get taskNameStyle(): { [key: string]: string } {
        const width = 2.2 + (this.skulls - 1) * this.skullSpacing;

        return { 'max-width': `calc(100% - ${width}rem)` };
    }

    get skulls(): number {
        const options = store.getters['taskItem/taskItemOptions'] as TaskItemOptions;

        return Math.floor(this.task.estimate / options.skullDuration);
    }

    get isRecur(): boolean {
        return this.task.recur.some(_ => _);
    }

    public getSkullStyle(index: number): { [key: string]: string } {
        const step = Math.floor(0.9 / this.skulls * 10) / 10;

        return {
            right: `${index * this.skullSpacing}rem`,
            filter: `brightness(${1 - (this.skulls - 1 - index) * step})`
        };
    }
}
</script>

<style lang="scss" scoped>
.task-summary-card-container {
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.4rem;

    &:hover {
        cursor: pointer;
        color: rgba(255, 255, 255);
        filter: brightness(1.2);
    }

    .card-content {
        display: flex;
        flex-grow: 1;
        align-items: center;
        position: relative;
        transition: opacity 0.15s, color 0.3s;

        & > span:first-of-type {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .card-actions {
        display: flex;
        flex-grow: 0;
        justify-content: center;
        align-items: center;
        margin-right: 0.3rem;
        max-width: 0.75rem;
        height: 50%;
        border-radius: 4px;
        background-color: rgb(175, 27, 22);

        &:hover {
            background-color: rgb(206, 37, 31);
        }

        .close-icon {
            display: none;
            font-size: 0.5rem;
            opacity: 0;
        }
    }

    &:hover .card-actions {
        flex-grow: 1;
        transition: flex 1s, background-color 0.3s;

        .close-icon {
            display: inline-block;
            animation: revealContent 0.2s ease-in forwards;
        }
    }

    .default-category-icon, .child-task-name {
        margin-left: 0.25rem;
    }

    .default-category-icon {
        margin-right: 0.25rem;
        width: 0.4rem;
        height: 0.4rem;
        border-radius: 50%;
    }

    .icon-indicator {
        margin-right: 1.5%;
        width: 0.6rem;
        height: 0.6rem;
        color: rgb(255, 255, 255);
    }

    .skulls {
        display: flex;
        align-items: center;
        position: absolute;
        right: 0;
        height: 100%;

        img {
            position: absolute;
            width: 1.25rem;
        }
    }

    .half-skull {
        width: 1.25rem;
        overflow: hidden;

        & > div {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            left: 0;
            width: 100%;
            height: 100%;
        }

        & > div:first-of-type {
            opacity: 0.4;
        }

        & > div:last-of-type {
            width: 50%;
            overflow: hidden;

            img {
                position: absolute;
                left: 0;
            }
        }
    }
}
</style>
