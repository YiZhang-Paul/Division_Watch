import { ActionContext } from 'vuex';

import { Category } from '../../core/data-model/generic/category';
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
    category: (state: ICategoryState) => (id: string): Category | null => {
        return state.categories.find(_ => _.id === id) ?? null;
    },
    categories: (state: ICategoryState): Category[] => state.categories.slice(),
    editableCategories: (state: ICategoryState): Category[] => state.categories.filter(_ => _.isEditable),
    activeCategory: (state: ICategoryState): Category | null => state.activeCategory
};

const mutations = {
    setCategories(state: ICategoryState, categories: Category[]): void {
        state.categories = categories;
    },
    setActiveCategory(state: ICategoryState, category: Category | null): void {
        state.activeCategory = category;
    }
};

const actions = {
    async loadCategories(context: ActionContext<ICategoryState, any>, autoOpen = false): Promise<void> {
        const { commit, getters } = context;
        commit('setCategories', await categoryHttpService.getCategories());

        if (autoOpen && !getters.activeCategory && getters.editableCategories[0]) {
            commit('setActiveCategory', getters.editableCategories[0]);
        }
    },
    swapActiveCategory(context: ActionContext<ICategoryState, any>, category: Category | null): void {
        context.commit('setActiveCategory', null);
        setTimeout(() => context.commit('setActiveCategory', category));
    }
}

export const categoryKey = 'category';

export const category = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
