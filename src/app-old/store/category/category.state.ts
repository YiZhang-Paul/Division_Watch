const mutations = {
    addCategory(state: ICategoryState, category: Category): void {
        state.categories = [...state.categories, category];
    },
    deleteCategory(state: ICategoryState, category: Category): void {
        state.categories = state.categories.filter(_ => _.id !== category.id);
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
    async deleteCategory(context: ActionContext<ICategoryState, any>, category: Category): Promise<boolean> {
        if (!await categoryHttpService.deleteCategory(category)) {
            return false;
        }

        context.commit('deleteCategory', category);

        return true;
    }
};
