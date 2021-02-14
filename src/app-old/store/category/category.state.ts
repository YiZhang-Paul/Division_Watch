const mutations = {
    deleteCategory(state: ICategoryState, category: Category): void {
        state.categories = state.categories.filter(_ => _.id !== category.id);
    }
};

const actions = {
    async deleteCategory(context: ActionContext<ICategoryState, any>, category: Category): Promise<boolean> {
        if (!await categoryHttpService.deleteCategory(category)) {
            return false;
        }

        context.commit('deleteCategory', category);

        return true;
    }
};
