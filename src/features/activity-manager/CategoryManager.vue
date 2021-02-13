<template>
    <div class="category-manager-container">
        <item-list-panel class="item-list-panel"
            @item:search="searchText = $event">

            <category-summary-card class="summary-card"
                v-for="category of categories"
                :key="category.id"
                :category="category"
                :isActive="category.id === activeCategory?.id"
                @click="onCategorySelected(category)">
            </category-summary-card>

            <placeholder-panel v-if="!categories.length"
                class="placeholder-panel"
                :text="searchText ? 'no matching entry found.' : 'no entry created yet.'">
            </placeholder-panel>
        </item-list-panel>

        <div v-if="!activeCategory" class="placeholder-wrapper">
            <placeholder-panel class="placeholder-panel" :text="'no entry selected.'"></placeholder-panel>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../store';
import { categoryKey } from '../../store/category/category.state';
// eslint-disable-next-line no-unused-vars
import { Category } from '../../core/data-model/generic/category';
import ItemListPanel from '../../shared/panels/ItemListPanel.vue';
import PlaceholderPanel from '../../shared/panels/PlaceholderPanel.vue';
import CategorySummaryCard from '../../shared/cards/CategorySummaryCard.vue';

@Options({
    components: {
        ItemListPanel,
        PlaceholderPanel,
        CategorySummaryCard
    }
})
export default class CategoryManager extends Vue {
    public searchText = '';

    get categories(): Category[] {
        return store.getters[`${categoryKey}/categories`];
    }

    get activeCategory(): Category | null {
        return store.getters[`${categoryKey}/activeCategory`];
    }

    public onCategorySelected(category: Category | null): void {
        if (!this.activeCategory || category?.id !== this.activeCategory.id) {
            store.dispatch(`${categoryKey}/swapActiveCategory`, category);
        }
    }
}
</script>

<style lang="scss" scoped>
.category-manager-container {
    $list-width: 29%;
    $content-width: 92.5%;

    .item-list-panel {
        width: $list-width;
        height: 97.5%;

        .placeholder-panel {
            margin-left: 2.5%;
            width: 95%;
        }
    }

    .placeholder-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        width: calc(100% - #{$list-width});
        height: 100%;

        .placeholder-panel {
            width: 35%;
        }
    }
}
</style>
