import { GenericUtility } from '../../core/utilities/generic/generic.utility';

export interface ICategoryState {
    activeCategory: Category | null;
}

const state = (): ICategoryState => ({
    activeCategory: null
});

const getters = {
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
    setActiveCategory(state: ICategoryState, category: Category): void {
        state.activeCategory = category;
    }
};

const actions = {
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
