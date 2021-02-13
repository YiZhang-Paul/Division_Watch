<template>
    <div class="category-manager-container">
        <item-list-panel class="item-list-panel"
            @item:search="searchText = $event">

            <category-summary-card class="summary-card"
                v-for="category of categories"
                :key="category.id"
                :category="category"
                :totalItems="categoryBreakdown.get(category.id)"
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
import { taskItemKey } from '../../store/task-item/task-item.state';
// eslint-disable-next-line no-unused-vars
import { Category } from '../../core/data-model/generic/category';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
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
        return store.getters[`${categoryKey}/editableCategories`];
    }

    get activeCategory(): Category | null {
        return store.getters[`${categoryKey}/activeCategory`];
    }

    get categoryBreakdown(): Map<string, number> {
        const breakdown = new Map<string, number>();
        const items: TaskItem[] = store.getters[`${taskItemKey}/incompleteItems`];

        for (const item of items) {
            const id = item.categoryId ?? '';
            breakdown.set(id, (breakdown.get(id) ?? 0) + 1);
        }

        return breakdown;
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

        .summary-card {
            width: 100%;
            height: 8.5vh;
            opacity: 0;
            animation: revealContent 0.3s ease 0.1s forwards;

            &:not(:nth-last-child(1)) {
                margin-bottom: 0.9vh;
            }
        }

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
