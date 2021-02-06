<template>
    <div v-if="task" class="task-summary-card">
        <div class="category"></div>
        <div class="splitter-1"></div>
        <div class="attributes"></div>
        <div class="splitter-2"></div>

        <div class="name">
            <span>{{ task.name }}</span>
        </div>

        <div class="splitter-3"></div>

        <div class="estimation">
            <div class="progress"></div>
            <div class="filler"></div>

            <div class="image-wrapper">
                <img src="../../assets/images/rogue_skull.png" />
            </div>

            <span>{{ estimation }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

import store from '../../store';
import { taskItemKey } from '../../store/task-item/task-item.state';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
// eslint-disable-next-line no-unused-vars
import { TaskItemOptions } from '../../core/data-model/task-item/task-item-options';

class TaskSummaryCardProp {
    public task = prop<TaskItem>({ default: null });
}

export default class TaskSummaryCard extends Vue.with(TaskSummaryCardProp) {

    get estimation(): string {
        const { skullDuration } = store.getters[`${taskItemKey}/taskItemOptions`] as TaskItemOptions;
        const estimation = this.task.estimate / skullDuration;

        return estimation < 1 ? '<1' : `x${Math.floor(estimation)}`;
    }
}
</script>

<style lang="scss" scoped>
.task-summary-card {
    $splitter-thickness: 1px;
    $tall-row-height: 62.5%;
    $narrow-column-width: 15%;

    & > div {
        box-sizing: border-box;
    }

    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    background-color: rgba(36, 35, 38, 0.75);
    color: rgb(255, 255, 255);
    font-size: 0.7rem;

    .category, .attributes, .splitter-1 {
        width: $narrow-column-width;
    }

    .name, .estimation, .splitter-3 {
        width: calc(100% - #{$narrow-column-width} - #{$splitter-thickness});
    }

    .splitter-1, .splitter-2, .splitter-3 {
        background-color: rgba(255, 255, 255, 0.5);
    }

    .category {
        height: calc(100% - #{$tall-row-height} - #{$splitter-thickness});
    }

    .splitter-1 {
        height: $splitter-thickness;
    }

    .attributes {
        height: $tall-row-height;
    }

    .splitter-2 {
        width: $splitter-thickness;
        height: 100%;
    }

    .name {
        padding: 1.5% 4%;
        height: calc(#{$tall-row-height} - #{$splitter-thickness});
    }

    .splitter-3 {
        height: $splitter-thickness;
    }

    .estimation {
        display: flex;
        justify-content: start;
        align-items: center;
        padding: 0 3.5%;
        height: calc(100% - #{$tall-row-height});
        font-size: 0.6rem;

        .progress {
            width: 62.5%;
            height: 0.9vh;
            border-radius: 1px;
            background-color: rgb(185, 185, 185);
        }

        .filler {
            flex-grow: 1;
        }

        .image-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 12.5%;
            height: 90%;
            overflow: hidden;

            img {
                height: 150%;
            }
        }

        span {
            align-self: flex-end;
        }
    }
}
</style>
