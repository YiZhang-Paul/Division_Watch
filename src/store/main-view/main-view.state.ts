import { ViewOption } from '../../core/enums/view-option.enum';

export interface IMainViewState {
    activeView: ViewOption;
}

const state = (): IMainViewState => ({
    activeView: ViewOption.Inactive
});

const getters = {
    activeView: (state: IMainViewState): ViewOption => state.activeView
};

const mutations = {
    setActiveView(state: IMainViewState, option: ViewOption): void {
        state.activeView = option;
    }
};

export const mainViewKey = 'mainView';

export const mainView = {
    namespaced: true,
    state,
    getters,
    mutations
};
