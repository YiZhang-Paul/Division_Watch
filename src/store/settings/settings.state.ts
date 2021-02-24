import { ActionContext } from 'vuex';

import { SessionSettings } from '../../core/data-model/settings/session-settings';
import { SessionSettingsOptions } from '../../core/data-model/settings/session-settings-options';
import { AppSettingsHttpService } from '../../core/services/http/app-settings-http/app-settings-http.service';

const appSettingsHttpService = new AppSettingsHttpService();

export interface ISettingsState {
    sessionSettings: SessionSettings;
    sessionSettingsOptions: SessionSettingsOptions;
}

const state = (): ISettingsState => ({
    sessionSettings: new SessionSettings(),
    sessionSettingsOptions: new SessionSettingsOptions()
});

const getters = {
    sessionSettings: (state: ISettingsState): SessionSettings => state.sessionSettings,
    sessionSettingsOptions: (state: ISettingsState): SessionSettingsOptions => state.sessionSettingsOptions
};

const mutations = {
    setSessionSettings(state: ISettingsState, settings: SessionSettings): void {
        state.sessionSettings = settings;
    },
    setSessionSettingsOptions(state: ISettingsState, options: SessionSettingsOptions): void {
        state.sessionSettingsOptions = options;
    }
};

const actions = {
    async loadSessionSettings(context: ActionContext<ISettingsState, any>): Promise<void> {
        context.commit('setSessionSettings', await appSettingsHttpService.getSessionSettings());
    },
    async loadSessionSettingsOptions(context: ActionContext<ISettingsState, any>): Promise<void> {
        context.commit('setSessionSettingsOptions', await appSettingsHttpService.getSessionSettingsOptions());
    },
    async updateSessionSettings(context: ActionContext<ISettingsState, any>, settings: SessionSettings): Promise<void> {
        if (await appSettingsHttpService.updateSessionSettings(settings)) {
            context.commit('setSessionSettings', settings);
        }
    }
};

export const settingsKey = 'settings';

export const settings = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
