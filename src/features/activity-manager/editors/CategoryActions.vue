<template>
    <div v-if="category" class="category-actions-container">
        <template v-if="!category.id">
            <menu-button class="action-button cancel-button" @click="cancelCreate()">Cancel</menu-button>
            <menu-button class="action-button" @click="createCategory(category)">Create</menu-button>
        </template>

        <menu-button v-if="category.id"
            class="action-button warning-button"
            @click="deleteCategory(category)">

            Delete
        </menu-button>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import store from '../../../store';
import { dialogKey } from '../../../store/dialog/dialog.state';
import { categoryKey } from '../../../store/category/category.state';
import { taskItemKey } from '../../../store/task-item/task-item.state';
// eslint-disable-next-line no-unused-vars
import { Category } from '../../../core/data-model/generic/category';
import { DialogOption } from '../../../core/data-model/generic/dialog-option';
import { DropdownOption } from '../../../core/data-model/generic/dropdown-option';
import MenuButton from '../../../shared/controls/MenuButton.vue';

class CategoryActionsProp {
    public category = prop<Category>({ default: null });
}

@Options({
    components: {
        MenuButton
    }
})
export default class CategoryActions extends Vue.with(CategoryActionsProp) {
    public isActionLocked = false;

    public async createCategory(category: Category): Promise<void> {
        const errors = await store.dispatch(`${categoryKey}/validateCategoryName`, category);

        if (errors.length) {
            const option = new DialogOption('Invalid transmission detected:', 'Got it', '', '', null, errors, true);
            store.dispatch(`${dialogKey}/openDialog`, option);

            return;
        }

        await this.execute(async() => {
            const result = await store.dispatch(`${categoryKey}/addCategory`, category);

            if (result) {
                store.dispatch(`${categoryKey}/swapActiveCategory`, result);
            }
        });
    }

    public cancelCreate(): void {
        this.execute(() => store.dispatch(`${categoryKey}/swapActiveCategory`, null));
    }

    public async deleteCategory(category: Category): Promise<void> {
        const title = 'This item will be permanently deleted.';
        const allCategories: Category[] = store.getters[`${categoryKey}/categories`];
        const remaining = allCategories.filter(_ => _.id !== category.id);
        const selected = remaining.find(_ => !_.isEditable && _.name === 'Default');
        const dropdown = new DropdownOption('move items to', remaining, selected, (_: Category) => _.name);
        const option = new DialogOption(title, 'Delete', 'Cancel', '', dropdown, [], true);

        option.confirmCallback = (_: boolean, transfer: Category) => {
            this.execute(async() => {
                const payload = { target: category, transfer };

                if (await store.dispatch(`${categoryKey}/deleteCategory`, payload)) {
                    store.dispatch(`${taskItemKey}/loadIncompleteItems`);
                }
            });
        };

        store.dispatch(`${dialogKey}/openDialog`, option);
    }

    private async execute(callback: (...args: any[]) => any): Promise<void> {
        if (!this.isActionLocked) {
            this.isActionLocked = true;
            await callback();
            this.isActionLocked = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.category-actions-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .action-button {
        padding-left: 0.65rem;
        padding-right: 0.65rem;
        height: 3.5vh;
        background-color: rgb(59, 163, 154);
        color: rgb(255, 255, 255);
        opacity: 0;
        animation: revealContent 0.25s ease 0.6s forwards;

        &:hover {
            background-color: rgb(75, 192, 182);
        }

        &:not(:nth-child(1)) {
            margin-left: 7%;
        }

        &.cancel-button {
            background-color: rgba(140, 140, 140, 0.25);

            &:hover {
                background-color: rgba(175, 175, 175, 0.35);
            }
        }

        &.warning-button {
            background-color: rgb(236, 33, 18);

            &:hover {
                background-color: rgb(238, 61, 49);
            }
        }
    }
}
</style>
