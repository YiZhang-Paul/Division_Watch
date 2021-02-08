<template>
    <div v-if="task"
        class="task-summary-card"
        :class="{ 'active-card': isActive }"
        @mouseover="isMouseover = true"
        @mouseout="isMouseover = false">

        <div class="category">
            <component v-if="categoryIcon" :is="categoryIcon" :style="{ color: category.color }"></component>
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
import { Autorenew } from 'mdue';

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
    background-color: rgba(36, 35, 38, 0.75);
    color: rgb(255, 255, 255);
    font-size: 0.7rem;
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
}
</style>
