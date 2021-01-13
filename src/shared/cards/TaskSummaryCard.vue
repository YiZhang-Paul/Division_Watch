<template>
    <div v-if="task" class="task-summary-card-container" :style="containerStyle">
        <div :style="indicatorStyle"></div>
        <span>{{ task.name }}</span>

        <div class="skulls">
            <img src="../../assets/images/rogue_skull.png" />
            <span>{{ skulls }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item';

class TaskSummaryCardProp {
    public task = prop<TaskItem>({ default: null });
}

export default class TaskSummaryCard extends Vue.with(TaskSummaryCardProp) {

    get containerStyle(): { [key: string]: string } {
        return { 'background-color': `rgba(${this.baseColor}, 0.5)` };
    }

    get indicatorStyle(): { [key: string]: string } {
        return { 'background-color': `rgb(${this.baseColor})` };
    }

    get baseColor(): string {
        if (!this.task.priority.rank) {
            return '73, 207, 73';
        }

        return this.task.priority.rank === 1 ? '238, 171, 70' : '231, 72, 72';
    }

    get skulls(): string {
        const total = Math.floor(this.task.estimate / 1500000);

        return total < 1 ? '< 1' : `x ${total}`;
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

    div:first-of-type {
        margin-right: 5%;
        width: 4%;
        height: 100%;
    }

    &:hover {
        cursor: pointer;
        color: rgba(255, 255, 255);
        filter: brightness(1.2);
    }

    .skulls {
        display: flex;
        align-items: center;
        position: absolute;
        right: 5%;
        font-weight: 600;

        img {
            position: absolute;
            right: 1em;
            width: 2.75em;
        }
    }
}
</style>
