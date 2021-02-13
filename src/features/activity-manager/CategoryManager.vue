<template>
    <div class="category-manager-container">
        <item-list-panel class="item-list-panel"
            @item:search="searchText = $event">

            <placeholder-panel v-if="!categories.length"
                class="placeholder-panel"
                :text="searchText ? 'no matching entry found.' : 'no entry created yet.'">
            </placeholder-panel>
        </item-list-panel>
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

@Options({
    components: {
        ItemListPanel,
        PlaceholderPanel
    }
})
export default class CategoryManager extends Vue {
    public searchText = '';

    get categories(): Category[] {
        return store.getters[`${categoryKey}/categories`];
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
}
</style>
