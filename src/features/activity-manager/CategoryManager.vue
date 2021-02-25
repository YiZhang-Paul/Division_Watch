<template>
    <div class="category-manager-container">
        <item-list-panel class="item-list-panel"
            @item:search="searchText = $event"
            @item:add="openEmptyCategory()">

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

        <div v-if="activeCategory" class="content">
            <div class="editor-area">
                <section-panel class="section-panel"
                    :name="activeCategory.name"
                    :isEditable="true"
                    :placeholder="'enter category name here...'"
                    :errorText="nameErrorText"
                    @name:edited="onCategoryChange('name', $event)"
                    @name:input="onNameInput($event)">

                    <field-textarea class="editor-control"
                        :name="'Description'"
                        v-model="activeCategory.description"
                        :placeholder="'add description here...'"
                        @update:modelValue="onCategoryChange('description', $event)">
                    </field-textarea>

                    <icon-selector class="editor-control"
                        :name="'Icon'"
                        :selected="activeCategory.icon"
                        @select="onCategoryChange('icon', $event)">
                    </icon-selector>

                    <color-selector class="editor-control"
                        :name="'Color'"
                        :selected="activeCategory.color"
                        @select="onCategoryChange('color', $event)">
                    </color-selector>
                </section-panel>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../store';
import { categoryKey } from '../../store/category/category.state';
import { taskItemKey } from '../../store/task-item/task-item.state';
import { Category } from '../../core/data-model/generic/category';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
import ItemListPanel from '../../shared/panels/ItemListPanel.vue';
import SectionPanel from '../../shared/panels/SectionPanel.vue';
import PlaceholderPanel from '../../shared/panels/PlaceholderPanel.vue';
import FieldTextarea from '../../shared/controls/FieldTextarea.vue';
import IconSelector from '../../shared/controls/IconSelector.vue';
import ColorSelector from '../../shared/controls/ColorSelector.vue';
import CategorySummaryCard from '../../shared/cards/CategorySummaryCard.vue';

@Options({
    components: {
        ItemListPanel,
        SectionPanel,
        PlaceholderPanel,
        FieldTextarea,
        IconSelector,
        ColorSelector,
        CategorySummaryCard
    }
})
export default class CategoryManager extends Vue {
    public searchText = '';
    public nameErrorText = '';
    private updateDebounceTimer: NodeJS.Timeout | null = null;

    get categories(): Category[] {
        const categories: Category[] = store.getters[`${categoryKey}/editableCategories`];

        return categories.filter(_ => _.name.toLowerCase().includes(this.searchText));
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

    public beforeUnmount(): void {
        if (this.updateDebounceTimer) {
            store.dispatch(`${categoryKey}/updateCategory`, this.activeCategory);
        }
    }

    public async onNameInput(input: string): Promise<void> {
        const name = (input ?? '').trim().toLowerCase();
        const category = { ...this.activeCategory, name } as Category;
        const errors = await store.dispatch(`${categoryKey}/validateCategoryName`, category);
        this.nameErrorText = errors[0] ?? '';
    }

    public openEmptyCategory(): void {
        this.onCategorySelected(new Category());
    }

    public onCategorySelected(category: Category | null): void {
        if (!this.activeCategory || category?.id !== this.activeCategory.id) {
            this.nameErrorText = '';
            store.dispatch(`${categoryKey}/swapActiveCategory`, category);
        }
    }

    public onCategoryChange(key: string, value: any, delay = 0): void {
        const changed = { ...this.activeCategory, [key]: value } as Category;
        setTimeout(() => store.commit(`${categoryKey}/setActiveCategory`, changed), delay);

        if (!changed.id) {
            return;
        }

        if (this.updateDebounceTimer) {
            clearTimeout(this.updateDebounceTimer);
        }

        this.updateDebounceTimer = setTimeout(() => {
            store.dispatch(`${categoryKey}/updateCategory`, this.activeCategory);
            this.updateDebounceTimer = null;
        }, 400);
    }
}
</script>

<style lang="scss" scoped>
.category-manager-container {
    $list-width: 28%;
    $content-width: 96.5%;

    .item-list-panel {
        width: $list-width;
        height: 97.5%;

        .summary-card {
            width: 100%;
            height: 9.5vh;
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

    .content {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        width: calc(100% - #{$list-width});
        height: 100%;

        .editor-area {
            padding-top: 1.5vh;
            width: $content-width;

            .section-panel {
                width: 100%;

                .editor-control {
                    width: 100%;
                }

                .editor-control:not(:nth-last-child(1)) {
                    margin-bottom: 1%;
                }
            }
        }
    }
}
</style>
