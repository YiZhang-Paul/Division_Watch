import { ActionContext } from 'vuex';

import { SoundSettings } from '../../core/data-model/settings/sound-settings';
import { SoundSettingsOptions } from '../../core/data-model/settings/sound-settings-options';
import { SessionSettings } from '../../core/data-model/settings/session-settings';
import { SessionSettingsOptions } from '../../core/data-model/settings/session-settings-options';
import { AppSettingsHttpService } from '../../core/services/http/app-settings-http/app-settings-http.service';

const appSettingsHttpService = new AppSettingsHttpService();

export interface ISettingsState {
    soundSettings: SoundSettings;
    soundSettingsOptions: SoundSettingsOptions;
    sessionSettings: SessionSettings;
    sessionSettingsOptions: SessionSettingsOptions;
}

const state = (): ISettingsState => ({
    soundSettings: new SoundSettings(),
    soundSettingsOptions: new SoundSettingsOptions(),
    sessionSettings: new SessionSettings(),
    sessionSettingsOptions: new SessionSettingsOptions()
});

const getters = {
    soundSettings: (state: ISettingsState): SoundSettings => state.soundSettings,
    soundSettingsOptions: (state: ISettingsState): SoundSettingsOptions => state.soundSettingsOptions,
    sessionSettings: (state: ISettingsState): SessionSettings => state.sessionSettings,
    sessionSettingsOptions: (state: ISettingsState): SessionSettingsOptions => state.sessionSettingsOptions
};

const mutations = {
    setSoundSettings(state: ISettingsState, settings: SoundSettings): void {
        state.soundSettings = settings;
    },
    setSoundSettingsOptions(state: ISettingsState, options: SoundSettingsOptions): void {
        state.soundSettingsOptions = options;
    },
    setSessionSettings(state: ISettingsState, settings: SessionSettings): void {
        state.sessionSettings = settings;
    },
    setSessionSettingsOptions(state: ISettingsState, options: SessionSettingsOptions): void {
        state.sessionSettingsOptions = options;
    }
};

const actions = {
    async loadSoundSettings(context: ActionContext<ISettingsState, any>): Promise<void> {
        context.commit('setSoundSettings', await appSettingsHttpService.getSoundSettings());
    },
    async loadSoundSettingsOptions(context: ActionContext<ISettingsState, any>): Promise<void> {
        context.commit('setSoundSettingsOptions', await appSettingsHttpService.getSoundSettingsOptions());
    },
    async updateSoundSettings(_: ActionContext<ISettingsState, any>, settings: SoundSettings): Promise<void> {
        await appSettingsHttpService.updateSoundSettings(settings);
    },
    async loadSessionSettings(context: ActionContext<ISettingsState, any>): Promise<void> {
        context.commit('setSessionSettings', await appSettingsHttpService.getSessionSettings());
    },
    async loadSessionSettingsOptions(context: ActionContext<ISettingsState, any>): Promise<void> {
        context.commit('setSessionSettingsOptions', await appSettingsHttpService.getSessionSettingsOptions());
    },
    async updateSessionSettings(_: ActionContext<ISettingsState, any>, settings: SessionSettings): Promise<void> {
        await appSettingsHttpService.updateSessionSettings(settings);
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
