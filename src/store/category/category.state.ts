import { ActionContext } from 'vuex';

import { Category } from '../../core/data-model/generic/category';
import { CategoryHttpService } from '../../core/services/http/category-http/category-http.service';

const categoryHttpService = new CategoryHttpService();

export interface ICategoryState {
    categories: Category[];
}

const state = (): ICategoryState => ({
    categories: []
});

const getters = {
    categories: (state: ICategoryState): Category[] => state.categories.slice()
};

const mutations = {
    setCategories(state: ICategoryState, categories: Category[]): void {
        state.categories = categories;
    }
};

const actions = {
    async loadCategories(context: ActionContext<ICategoryState, any>): Promise<void> {
        context.commit('setCategories', await categoryHttpService.getCategories());
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
