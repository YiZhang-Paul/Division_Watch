<template>
    <div class="category-summary-card-container"></div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import { Category } from '../../core/data-model/generic/category';

class CategorySummaryCardProp {
    public category = prop<Category>({ default: null });
    public isActive = prop<boolean>({ default: false });
}

@Options({

})
export default class CategorySummaryCard extends Vue.with(CategorySummaryCardProp) { }
</script>

<style lang="scss" scoped>

</style>
