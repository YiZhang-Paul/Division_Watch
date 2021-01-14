<template>
    <div v-if="task" class="task-summary-card-container" :style="containerStyle">
        <template v-if="!task.parent">
            <div class="default-category-indicator"></div>
            <rotate-3d-variant v-if="isRecur" class="icon-indicator" />
        </template>

        <span :class="{ 'child-task-name': task.parent }">{{ task.name }}</span>

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
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { Rotate_3dVariant } from 'mdue';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item';

class TaskSummaryCardProp {
    public task = prop<TaskItem>({ default: null });
}

@Options({
    components: {
        Rotate3dVariant: Rotate_3dVariant
    }
})
export default class TaskSummaryCard extends Vue.with(TaskSummaryCardProp) {

    get containerStyle(): { [key: string]: string } {
        return { 'background-color': `rgba(${this.baseColor}, 0.5)` };
    }

    get baseColor(): string {
        if (!this.task.priority.rank) {
            return '73, 207, 73';
        }

        return this.task.priority.rank === 1 ? '238, 171, 70' : '231, 72, 72';
    }

    get skulls(): number {
        return Math.floor(this.task.estimate / 1500000);
    }

    get isRecur(): boolean {
        return this.task.recur.some(_ => _);
    }

    public getSkullStyle(index: number): { [key: string]: string } {
        const step = Math.floor(0.9 / this.skulls * 10) / 10;

        return {
            right: `${index * 0.75}em`,
            filter: `brightness(${1 - (this.skulls - 1 - index) * step})`
        };
    }
}
</script>

<style lang="scss" scoped>
.task-summary-card-container {
    display: flex;
    align-items: center;
    position: relative;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9em;
    transition: opacity 0.15s, color 0.3s;

    &:hover {
        cursor: pointer;
        color: rgba(255, 255, 255);
        filter: brightness(1.2);
    }

    .default-category-indicator, .child-task-name {
        margin-left: 0.75em;
    }

    .default-category-indicator {
        margin-right: 0.25em;
        width: 0.9em;
        height: 0.9em;
        border-radius: 50%;
        background-color: rgb(33, 136, 233);
    }

    .icon-indicator {
        margin-right: 0.25em;
        width: 1.25em;
        height: 1.25em;
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
            width: 3.75em;
        }
    }

    .half-skull {
        width: 3.75em;
        overflow: hidden;

        & > div {
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
            }
        }
    }
}
</style>
