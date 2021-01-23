import { ActionContext } from 'vuex';

import { Category } from '../../core/data-model/category';
import { CategoryHttpService } from '../../core/services/http/category-http/category-http.service';
import { GenericUtility } from '../../core/utilities/generic/generic.utility';

const categoryHttpService = new CategoryHttpService();

export interface ICategoryState {
    categories: Category[];
    activeCategory: Category | null;
}

const state = (): ICategoryState => ({
    categories: [],
    activeCategory: null
});

const getters = {
    category: (state: ICategoryState) => (id: string): Category | null => {
        return state.categories.find(_ => _.id === id) ?? null;
    },
    categories: (state: ICategoryState): Category[] => state.categories.slice(),
    activeCategory: (state: ICategoryState): Category | null => state.activeCategory
};

const mutations = {
    addCategory(state: ICategoryState, category: Category): void {
        state.categories = [...state.categories, category];
    },
    setCategory(state: ICategoryState, category: Category): void {
        const index = state.categories.findIndex(_ => _.id === category.id);

        if (index !== -1) {
            state.categories = GenericUtility.replaceAt(state.categories, category, index);
        }
    },
    deleteCategory(state: ICategoryState, category: Category): void {
        state.categories = state.categories.filter(_ => _.id !== category.id);
    },
    setCategories(state: ICategoryState, categories: Category[]): void {
        state.categories = categories;
    },
    setActiveCategory(state: ICategoryState, category: Category): void {
        state.activeCategory = category;
    }
};

const actions = {
    async loadCategories(context: ActionContext<ICategoryState, any>): Promise<void> {
        context.commit('setCategories', await categoryHttpService.getCategories());
    },
    async addCategory(context: ActionContext<ICategoryState, any>, category: Category): Promise<Category> {
        const added = await categoryHttpService.addCategory(category);

        if (added) {
            context.commit('addCategory', added);
        }

        return added;
    },
    async updateCategory(context: ActionContext<ICategoryState, any>, category: Category): Promise<void> {
        if (await categoryHttpService.updateCategory(category)) {
            context.commit('setCategory', category);
        }
    },
    async deleteCategory(context: ActionContext<ICategoryState, any>, category: Category): Promise<boolean> {
        if (!await categoryHttpService.deleteCategory(category)) {
            return false;
        }

        context.commit('deleteCategory', category);

        return true;
    },
    swapActiveCategory(context: ActionContext<ICategoryState, any>, category: Category): void {
        context.commit('setActiveCategory', null);
        setTimeout(() => context.commit('setActiveCategory', category));
    }
};

export const category = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
