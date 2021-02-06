<template>
    <div v-if="task" class="task-summary-card">
        <div class="category"></div>
        <div class="splitter-1"></div>

        <div class="attributes">
            <div class="priority-indicator">
                <chevron-up class="arrow-icon"
                    v-for="n in 3"
                    :key="n"
                    :style="{ color: n - 1 <= task.priority.rank ? priorityColor : null }" />
            </div>

            <autorenew class="recur-indicator" :class="{ 'recur-active': task.recur.some(_ => _) }" />
        </div>

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
import { Options, Vue, prop } from 'vue-class-component';
import { Autorenew, ChevronUp } from 'mdue';

import store from '../../store';
import { taskItemKey } from '../../store/task-item/task-item.state';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
// eslint-disable-next-line no-unused-vars
import { TaskItemOptions } from '../../core/data-model/task-item/task-item-options';

class TaskSummaryCardProp {
    public task = prop<TaskItem>({ default: null });
}

@Options({
    components: {
        Autorenew,
        ChevronUp
    }
})
export default class TaskSummaryCard extends Vue.with(TaskSummaryCardProp) {

    get estimation(): string {
        const { skullDuration } = store.getters[`${taskItemKey}/taskItemOptions`] as TaskItemOptions;
        const estimation = this.task.estimate / skullDuration;

        return estimation < 1 ? '<1' : `x${Math.floor(estimation)}`;
    }

    get priorityColor(): string {
        if (!this.task.priority.rank) {
            return 'rgb(40, 212, 57)';
        }

        return `rgb(${this.task.priority.rank === 1 ? '238, 171, 70' : '231, 72, 72'})`;
    }
}
</script>

<style lang="scss" scoped>
.task-summary-card {
    $splitter-thickness: 1px;
    $attribute-row-height: 65%;
    $tall-row-height: 62.5%;
    $narrow-column-width: 15%;

    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    background-color: rgba(36, 35, 38, 0.75);
    color: rgb(255, 255, 255);
    font-size: 0.7rem;
    transition: background-color 0.3s;

    &:hover {
        cursor: pointer;
        background-color: rgb(72, 66, 110);
    }

    & > div {
        box-sizing: border-box;
    }

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
        height: calc(100% - #{$attribute-row-height} - #{$splitter-thickness});
    }

    .splitter-1 {
        height: $splitter-thickness;
    }

    .attributes {
        $inactive-color: rgba(170, 170, 170, 0.45);

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: $attribute-row-height;
        font-size: 1rem;

        .priority-indicator {
            $dimension: 1rem;
            $font-size: 1.35rem;

            position: relative;
            width: $dimension;
            height: $dimension;
            overflow: hidden;
            color: $inactive-color;
            font-size: $font-size;

            .arrow-icon {
                $distance: 0.275rem;
                $margin: calc((#{$dimension} - #{$font-size}) / 2);

                position: absolute;
                top: $margin;
                left: $margin;

                &:nth-child(1) {
                    top: calc(#{$margin} + #{$distance});
                }

                &:nth-child(3) {
                    top: calc(#{$margin} - #{$distance});
                }
            }
        }

        .recur-indicator {
            color: $inactive-color;
            transform: rotate(90deg) rotateY(180deg);

            &.recur-active {
                color: rgb(255, 255, 255);
            }
        }
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
            width: 67.5%;
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
            height: 85%;
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
