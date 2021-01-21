<template>
    <div class="category-summary-card-container">
        <span>{{ category.name }}</span>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import { Category } from '../../core/data-model/category';

class CategorySummaryCardProp {
    public category = prop<Category>({ default: null });
}

export default class CategorySummaryCard extends Vue.with(CategorySummaryCardProp) { }
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

    & > span:first-of-type {
        margin-left: 0.5rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
