import { ActionContext } from 'vuex';

import { settingsKey } from '../settings/settings.state';
import { Sound } from '../../core/data-model/generic/sound';
import { SoundOption } from '../../core/data-model/generic/sound-option';
import { SoundType } from '../../core/enums/sound-type.enum';
import { SoundSettings } from '../../core/data-model/settings/sound-settings';

export interface ISoundState {
    uiSounds: Sound[];
    clockSounds: Sound[];
}

const state = (): ISoundState => ({
    uiSounds: [],
    clockSounds: []
});

const getters = {
    getAllSounds: (state: ISoundState): Sound[] => {
        return [...state.uiSounds, ...state.clockSounds];
    },
    getUISound: (state: ISoundState) => (name: string): Sound | null => {
        return state.uiSounds.find(_ => _.name === name) ?? null;
    },
    getClockSound: (state: ISoundState) => (name: string): Sound | null => {
        return state.clockSounds.find(_ => _.name === name) ?? null;
    }
};

const mutations = {
    addUISound(state: ISoundState, sound: Sound): void {
        state.uiSounds = [...state.uiSounds, sound];
    },
    addClockSound(state: ISoundState, sound: Sound): void {
        state.clockSounds = [...state.clockSounds, sound];
    }
};

const actions = {
    setAllVolume(context: ActionContext<ISoundState, any>, payload: { type: SoundType; volume: number }): void {
        const { getters, state, rootGetters } = context;
        const { type, volume } = payload;
        const { isMuted, masterVolume } = rootGetters[`${settingsKey}/soundSettings`] as SoundSettings;
        let sounds: Sound[] = [];

        if (type === SoundType.UI) {
            sounds = state.uiSounds;
        }
        else if (type === SoundType.Clock) {
            sounds = state.clockSounds;
        }
        else {
            sounds = getters.getAllSounds;
        }

        for (const sound of sounds as Sound[]) {
            sound.volume = isMuted ? 0 : masterVolume / 100 * volume;
        }
    },
    playSound(context: ActionContext<ISoundState, any>, option: SoundOption): void {
        const { getters, commit, dispatch, rootGetters } = context;
        const { name, type, loop } = option;
        let sound: Sound | null = null;

        if (type === SoundType.UI) {
            sound = getters.getUISound(name);
        }
        else if (type === SoundType.Clock) {
            sound = getters.getClockSound(name);
        }

        if (!sound) {
            const { uiVolume, clockVolume } = rootGetters[`${settingsKey}/soundSettings`] as SoundSettings;
            sound = new Sound(name);

            if (type === SoundType.UI) {
                commit('addUISound', sound);
                dispatch('setAllVolume', { type, volume: uiVolume / 100 });
            }
            else if (type === SoundType.Clock) {
                commit('addClockSound', sound);
                dispatch('setAllVolume', { type, volume: clockVolume / 100 });
            }
        }

        sound.play(loop);
    },
    stopSound(context: ActionContext<ISoundState, any>, option: SoundOption): void {
        const { name, type } = option;
        let sound: Sound | null = null;

        if (type === SoundType.UI) {
            sound = context.getters.getUISound(name);
        }
        else if (type === SoundType.Clock) {
            sound = context.getters.getClockSound(name);
        }

        sound?.stop();
    }
};

export const soundKey = 'sound';

export const sound = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
