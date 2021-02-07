<template>
    <div v-if="task"
        class="task-summary-card"
        :class="{ 'mouseover-card': isMouseover }"
        @mouseover="isMouseover = true"
        @mouseout="isMouseover = false">

        <div class="category">
            <component v-if="categoryIcon" :is="categoryIcon" :style="{ color: category.color }"></component>
        </div>

        <div class="splitter-1"></div>

        <div class="attributes">
            <div class="priority-indicator">
                <chevron-up class="arrow-icon" v-for="n in 3" :key="n" :style="getArrowStyle(n - 1)" />
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
            <estimation-skulls class="estimation-skulls" :estimation="task.estimate"></estimation-skulls>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { Autorenew, ChevronUp } from 'mdue';

import store from '../../store';
import { categoryKey } from '../../store/category/category.state';
// eslint-disable-next-line no-unused-vars
import { Category } from '../../core/data-model/generic/category';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
import EstimationSkulls from '../../shared/widgets/EstimationSkulls.vue';
import { GenericUtility } from '../../core/utilities/generic/generic.utility';

class TaskSummaryCardProp {
    public task = prop<TaskItem>({ default: null });
}

@Options({
    components: {
        Autorenew,
        ChevronUp,
        EstimationSkulls
    }
})
export default class TaskSummaryCard extends Vue.with(TaskSummaryCardProp) {
    public isMouseover = false;

    get category(): Category | null {
        return store.getters[`${categoryKey}/category`](this.task.categoryId);
    }

    get categoryIcon(): any {
        return GenericUtility.getIcon(this.category?.icon ?? '');
    }

    get priorityColor(): string {
        if (!this.task.priority.rank) {
            return 'rgb(40, 212, 57)';
        }

        return `rgb(${this.task.priority.rank === 1 ? '238, 171, 70' : '231, 72, 72'})`;
    }

    public getArrowStyle(index: number): { [key: string]: string | null } {
        const color = index <= this.task.priority.rank ? this.priorityColor : null;

        return { '--priority-color': color, color };
    }
}
</script>

<style lang="scss" scoped>
.task-summary-card {
    $splitter-thickness: 1px;
    $attribute-row-height: 65%;
    $tall-row-height: 62.5%;
    $narrow-column-width: 15%;
    $inactive-color: rgba(170, 170, 170, 0.45);

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

    &.mouseover-card .arrow-icon {
        animation: glowArrow 1s ease infinite;
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
        display: flex;
        justify-content: center;
        align-items: center;
        height: calc(100% - #{$attribute-row-height} - #{$splitter-thickness});
        font-size: 1rem;
    }

    .splitter-1 {
        height: $splitter-thickness;
    }

    .attributes {
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
        justify-content: flex-start;
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

        .estimation-skulls {
            width: 22.5%;
            height: 100%;
        }
    }

    @keyframes glowArrow {
        0% {
            color: var(--priority-color);
        }
        50% {
            color: $inactive-color;
        }
        100% {
            color: var(--priority-color);
        }
    }
}
</style>
