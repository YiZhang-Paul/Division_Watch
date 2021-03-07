import { ActionContext } from 'vuex';

import { DialogPayload } from '../../core/data-model/generic/dialog-payload';
import { DialogOption } from '../../core/data-model/generic/dialog-option';

export interface IDialogState {
    activePayload: DialogPayload<any> | null;
    dialogOption: DialogOption<any> | null;
}

const state = (): IDialogState => ({
    activePayload: null,
    dialogOption: null
});

const getters = {
    activePayload: (state: IDialogState): DialogPayload<any> | null => state.activePayload,
    dialogOption: (state: IDialogState): DialogOption<any> | null => state.dialogOption
};

const mutations = {
    setActivePayload(state: IDialogState, payload: DialogPayload<any> | null): void {
        state.activePayload = payload;
    },
    setDialogOption(state: IDialogState, option: DialogOption<any> | null): void {
        state.dialogOption = option;
    }
};

const actions = {
    open(context: ActionContext<IDialogState, any>, payload: DialogPayload<any> | null): void {
        context.commit('setActivePayload', payload);
    },
    close(context: ActionContext<IDialogState, any>): void {
        context.commit('setActivePayload', null);
    },
    openDialog(context: ActionContext<IDialogState, any>, option: DialogOption<any>): void {
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
