import { ActionContext } from 'vuex';

import { DialogPayload } from '../../core/data-model/generic/dialog-payload';

export interface IDialogState {
    activePayload: DialogPayload<any> | null;
}

const state = (): IDialogState => ({
    activePayload: null
});

const getters = {
    activePayload: (state: IDialogState): DialogPayload<any> | null => state.activePayload
};

const mutations = {
    setActivePayload(state: IDialogState, payload: DialogPayload<any> | null): void {
        state.activePayload = payload;
    }
};

const actions = {
    open(context: ActionContext<IDialogState, any>, payload: DialogPayload<any> | null): void {
        context.commit('setActivePayload', payload);
    },
    close(context: ActionContext<IDialogState, any>): void {
        context.commit('setActivePayload', null);
    }
};

export const dialogKey = 'dialog';

export const dialog = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
