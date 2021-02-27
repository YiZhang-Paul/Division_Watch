import { ActionContext } from 'vuex';

import { Sound } from '../../core/data-model/generic/sound';
import { SoundOption } from '../../core/data-model/generic/sound-option';
import { SoundType } from '../../core/enums/sound-type.enum';

export interface ISoundState {
    isMuted: boolean;
    masterVolume: number;
    clockSounds: { sounds: Sound[]; volume: number };
}

const state = (): ISoundState => ({
    isMuted: false,
    masterVolume: 0.5,
    clockSounds: { sounds: [], volume: 1 }
});

const getters = {
    getAllSounds: (state: ISoundState): Sound[] => {
        return [...state.clockSounds.sounds];
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
    addClockSound(state: ISoundState, sound: Sound): void {
        sound.volume = state.isMuted ? 0 : state.masterVolume * state.clockSounds.volume;
        state.clockSounds.sounds = [...state.clockSounds.sounds, sound];
    }
};

const actions = {
    mute(context: ActionContext<ISoundState, any>): void {
        context.commit('setIsMuted', true);

        for (const sound of context.getters.getAllSounds as Sound[]) {
            sound.volume = 0;
        }
    },
    playSound(context: ActionContext<ISoundState, any>, option: SoundOption): void {
        const { getters, commit } = context;
        const { name, type, loop } = option;
        let sound: Sound | null = null;

        if (type === SoundType.Clock) {
            sound = getters.getClockSound(name);
        }

        if (!sound) {
            sound = new Sound(name);

            if (type === SoundType.Clock) {
                commit('addClockSound', sound);
            }
        }

        sound.play(loop);
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
