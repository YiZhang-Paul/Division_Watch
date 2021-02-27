import { ActionContext } from 'vuex';

import { Sound } from '../../core/data-model/generic/sound';
import { SoundOption } from '../../core/data-model/generic/sound-option';
import { SoundType } from '../../core/enums/sound-type.enum';

export interface ISoundState {
    isMuted: boolean;
    masterVolume: number;
    uiSounds: { sounds: Sound[]; volume: number };
    clockSounds: { sounds: Sound[]; volume: number };
}

const state = (): ISoundState => ({
    isMuted: false,
    masterVolume: 0.5,
    uiSounds: { sounds: [], volume: 1 },
    clockSounds: { sounds: [], volume: 1 }
});

const getters = {
    getAllSounds: (state: ISoundState): Sound[] => {
        return [...state.uiSounds.sounds, ...state.clockSounds.sounds];
    },
    getUISound: (state: ISoundState) => (name: string): Sound | null => {
        return state.uiSounds.sounds.find(_ => _.name === name) ?? null;
    },
    getClockSound: (state: ISoundState) => (name: string): Sound | null => {
        return state.clockSounds.sounds.find(_ => _.name === name) ?? null;
    }
};

const mutations = {
    setIsMuted(state: ISoundState, isMuted: boolean): void {
        state.isMuted = isMuted;
    },
    setMasterVolume(state: ISoundState, volume: number): void {
        state.masterVolume = Math.max(0, Math.min(volume, 1));
    },
    addUISound(state: ISoundState, sound: Sound): void {
        sound.volume = state.isMuted ? 0 : state.masterVolume * state.uiSounds.volume;
        state.uiSounds.sounds = [...state.uiSounds.sounds, sound];
    },
    addClockSound(state: ISoundState, sound: Sound): void {
        sound.volume = state.isMuted ? 0 : state.masterVolume * state.clockSounds.volume;
        state.clockSounds.sounds = [...state.clockSounds.sounds, sound];
    }
};

const actions = {
    mute(context: ActionContext<ISoundState, any>, type: SoundType): void {
        const { getters, commit, state } = context;
        let sounds: Sound[] = [];

        if (type === SoundType.Clock) {
            sounds = state.clockSounds.sounds;
        }
        else {
            sounds = getters.getAllSounds;
            commit('setIsMuted', true);
        }

        for (const sound of sounds as Sound[]) {
            sound.volume = 0;
        }
    },
    playSound(context: ActionContext<ISoundState, any>, option: SoundOption): void {
        const { getters, commit } = context;
        const { name, type, loop } = option;
        let sound: Sound | null = null;

        if (type === SoundType.UI) {
            sound = getters.getUISound(name);
        }
        else if (type === SoundType.Clock) {
            sound = getters.getClockSound(name);
        }

        if (!sound) {
            sound = new Sound(name);

            if (type === SoundType.UI) {
                commit('addUISound', sound);
            }
            else if (type === SoundType.Clock) {
                commit('addClockSound', sound);
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
