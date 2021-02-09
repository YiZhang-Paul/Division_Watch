import { ActionContext } from 'vuex';

import { DialogOption } from '../../core/data-model/generic/dialog-option';

export interface IDialogState {
    dialogOption: DialogOption | null;
}

const state = (): IDialogState => ({
    dialogOption: null
});

const getters = {
    dialogOption: (state: IDialogState): DialogOption | null => state.dialogOption
};

const mutations = {
    setDialogOption(state: IDialogState, option: DialogOption | null): void {
        state.dialogOption = option;
    }
};

const actions = {
    openDialog(context: ActionContext<IDialogState, any>, option: DialogOption): void {
        context.commit('setDialogOption', option);
    },
    closeDialog(context: ActionContext<IDialogState, any>): void {
        context.commit('setDialogOption', null);
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
