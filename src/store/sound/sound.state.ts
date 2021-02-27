import { ActionContext } from 'vuex';

import { Sound } from '../../core/data-model/generic/sound';

export interface ISoundState {
    masterVolume: number;
    isMuted: boolean;
    sounds: Sound[];
}

const state = (): ISoundState => ({
    masterVolume: 1,
    isMuted: false,
    sounds: []
});

const getters = {
    getSound: (state: ISoundState) => (name: string): Sound | null => {
        return state.sounds.find(_ => _.name === name) ?? null;
    }
};

const mutations = {
    setMasterVolume(state: ISoundState, volume: number): void {
        state.masterVolume = Math.max(0, Math.min(volume, 1));
    },
    setIsMuted(state: ISoundState, isMuted: boolean): void {
        state.isMuted = isMuted;
    },
    addSound(state: ISoundState, sound: Sound): void {
        state.sounds = [...state.sounds, sound];
    }
};

const actions = {
    playSound(context: ActionContext<ISoundState, any>, name: string): void {
        const { state, getters, commit } = context;
        let sound: Sound = getters.getSound(name);

        if (!sound) {
            sound = new Sound(name);
            sound.volume = state.masterVolume;
            commit('addSound', sound);
        }

        sound.play(0);
    },
    loopSound(context: ActionContext<ISoundState, any>, payload: { name: string; interval: number }): void {
        const { state, getters, commit } = context;
        let sound: Sound = getters.getSound(payload.name);

        if (!sound) {
            sound = new Sound(payload.name);
            sound.volume = state.masterVolume;
            commit('addSound', sound);
        }

        sound.loop(payload.interval);
    },
    stopSound(context: ActionContext<ISoundState, any>, name: string): void {
        context.getters.getSound(name)?.stop();
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
