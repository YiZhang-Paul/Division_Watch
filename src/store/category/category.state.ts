import { ActionContext } from 'vuex';

import { Category } from '../../core/data-model/category';
import { CategoryHttpService } from '../../core/services/http/category-http/category-http.service';

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
    categories: (state: ICategoryState): Category[] => state.categories.slice(),
    activeCategory: (state: ICategoryState): Category | null => state.activeCategory
};

const mutations = {
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
