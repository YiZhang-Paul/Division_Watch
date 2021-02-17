<template>
    <div v-if="task"
        class="task-summary-card"
        :class="{ 'active-card': isActive }"
        @mouseover="isMouseover = true"
        @mouseout="isMouseover = false">

        <div v-if="isActive" class="active-indicator">
            <div class="triangle"></div>

            <div class="square">
                <bullseye />
            </div>
        </div>

        <div class="category">
            <component v-if="categoryIcon"
                class="icon"
                :is="categoryIcon"
                :style="{ color: category.color }">
            </component>
        </div>

        <div class="splitter-1"></div>

        <div class="attributes">
            <priority-indicator :priority="task.priority.rank" :isGlowing="isMouseover"></priority-indicator>
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
import { Autorenew, Bullseye } from 'mdue';

import store from '../../store';
import { categoryKey } from '../../store/category/category.state';
// eslint-disable-next-line no-unused-vars
import { Category } from '../../core/data-model/generic/category';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
import PriorityIndicator from '../../shared/widgets/PriorityIndicator.vue';
import EstimationSkulls from '../../shared/widgets/EstimationSkulls.vue';
import { GenericUtility } from '../../core/utilities/generic/generic.utility';

class TaskSummaryCardProp {
    public task = prop<TaskItem>({ default: null });
    public isActive = prop<boolean>({ default: false });
}

@Options({
    components: {
        Autorenew,
        Bullseye,
        PriorityIndicator,
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
    position: relative;
    background-color: rgba(36, 35, 38, 0.75);
    color: rgb(255, 255, 255);
    font-size: 0.65rem;
    transition: background-color 0.3s;

    &:hover {
        cursor: pointer;
        background-color: rgb(72, 66, 110);
    }

    &.active-card {
        background-color: rgb(29, 24, 44);

        .name {
            color: rgb(247, 174, 18);
        }
    }

    & > div {
        box-sizing: border-box;
    }

    .active-indicator {
        $dimension: 0.7rem;

        position: absolute;
        top: 0;
        right: 0;
        width: $dimension;
        height: $dimension;
        color: rgb(0, 0, 0);
        font-size: 0.65rem;
        opacity: 0;
        animation: revealContent 0.25s ease 0.1s forwards;

        .triangle {
            position: absolute;
            top: 0;
            right: 0;
            width: 0;
            height: 0;
            border-top: $dimension solid transparent;
            border-bottom: $dimension solid transparent;
            border-right: $dimension solid rgb(255, 255, 255);
        }

        .square {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: $dimension;
            height: $dimension;
            background-color: rgb(255, 255, 255);
        }
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
        font-size: 0.85rem;

        .icon {
            opacity: 0;
            animation: revealContent 0.3s ease forwards;
        }
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
        font-size: 0.85rem;

        .recur-indicator {
            color: $inactive-color;
            transition: color 0.3s;
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
        transition: color 0.3s;
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
            width: 65%;
            height: 0.85vh;
            border-radius: 1px;
            background-color: rgb(185, 185, 185);
        }

        .filler {
            flex-grow: 1;
        }

        .estimation-skulls {
            width: 21.5%;
            height: 100%;
        }
    }
}
</style>
