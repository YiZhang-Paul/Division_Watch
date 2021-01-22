<template>
    <div class="category-summary-card-container">
        <component v-if="icon"
            class="icon"
            :style="{ color: category.color }"
            :is="icon">
        </component>

        <div v-if="!category.icon"
            class="default-icon"
            :style="{ 'background-color': category.color }">
        </div>

        <span>{{ category.name }}</span>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import { Category } from '../../core/data-model/category';
import { GenericUtility } from '../../core/utilities/generic/generic.utility';

class CategorySummaryCardProp {
    public category = prop<Category>({ default: null });
}

export default class CategorySummaryCard extends Vue.with(CategorySummaryCardProp) {

    get icon(): any {
        return GenericUtility.getIcon(this.category.icon);
    }
}
</script>

<style lang="scss" scoped>
.category-summary-card-container {
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.7);
    background-color: rgba(85, 85, 85, 0.4);
    font-size: 0.4rem;
    transition: opacity 0.15s, color 0.3s;

    &:hover {
        cursor: pointer;
        color: rgba(255, 255, 255);
        filter: brightness(1.2);
    }

    .default-icon {
        margin-left: 0.35rem;
        margin-right: 0.075rem;
        width: 0.45rem;
        height: 0.45rem;
        border-radius: 50%;
    }

    .icon {
        margin-left: 0.225rem;
        width: 0.65rem;
        height: 0.65rem;
    }

    & > span:first-of-type {
        margin-left: 0.25rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
