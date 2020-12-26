import { ActionContext } from 'vuex';

import { ValueChange } from '../../core/data-model/value-change';
import { RangeChange } from '../../core/data-model/range-change';

export interface IWatchColorOption {
    background: string;
    borderRing: string;
    borderRingShadow: string;
    outerRing: string;
    outerRingShadow: string;
    innerRing: string;
    innerRingShadow: string;
    scale: string;
    scaleSeparator: string;
    scaleGuard: string;
    dayOfWeek: string;
    time: string;
    batteryOutline: string;
    batteryHigh: string;
    menuBorder: string;
    menuBorderShadow: string;
}

export interface IAngleAnimation {
    borderRing: ValueChange[];
    outerRing: ValueChange[];
    innerRing: ValueChange[];
    scale: ValueChange[];
    scaleGuard: ValueChange[];
}

export interface IBlurAnimation {
    background: RangeChange[];
    borderRing: RangeChange[];
    outerRing: RangeChange[];
}

export interface IWatchBaseState {
    colorOption: IWatchColorOption;
    angleAnimation: IAngleAnimation;
    blurAnimation: IBlurAnimation;
}

const defaultColorOption: IWatchColorOption = {
    background: 'rgb(30, 30, 30)',
    borderRing: 'rgb(243, 245, 108)',
    borderRingShadow: 'rgba(227, 94, 19, 0.95)',
    outerRing: 'rgb(253, 244, 30)',
    outerRingShadow: 'rgba(235, 249, 83, 0.85)',
    innerRing: 'rgba(119, 73, 31, 0.3)',
    innerRingShadow: 'rgba(0, 0, 0, 0)',
    scale: 'rgb(250, 137, 31)',
    scaleSeparator: 'rgb(250, 137, 31)',
    scaleGuard: 'rgb(148, 75, 8)',
    dayOfWeek: 'rgb(211, 112, 19)',
    time: 'rgb(211, 112, 19)',
    batteryOutline: 'rgba(255, 255, 255, 0.5)',
    batteryHigh: 'rgb(0, 255, 0)',
    menuBorder: 'rgba(218, 220, 69, 0.9)',
    menuBorderShadow: 'rgba(227, 94, 19, 0.85)'
};

const state = () => ({
    colorOption: { ...defaultColorOption },
    angleAnimation: {
        borderRing: [new ValueChange(360, 60000)],
        outerRing: [new ValueChange(-120, 8500), new ValueChange(180, 1500)],
        innerRing: [new ValueChange(360, 12000)],
        scale: [],
        scaleGuard: [new ValueChange(120, 8500), new ValueChange(-180, 1500)]
    },
    blurAnimation: {
        background: [new RangeChange(8, 20, 3000), new RangeChange(20, 8, 3000)],
        borderRing: [new RangeChange(1, 3, 3000), new RangeChange(3, 1, 3000)],
        outerRing: [new RangeChange(3, 12, 3000), new RangeChange(12, 3, 3000)]
    }
});

const getters = {
    colorOption: (state: IWatchBaseState): IWatchColorOption => state.colorOption,
    angleAnimation: (state: IWatchBaseState): IAngleAnimation => state.angleAnimation,
    blurAnimation: (state: IWatchBaseState): IBlurAnimation => state.blurAnimation
};

const mutations = {
    setColor(state: IWatchBaseState, color: IWatchColorOption): void {
        state.colorOption = color;
    }
};

const actions = {
    setAgentColorScheme(context: ActionContext<IWatchBaseState, any>): void {
        const option: IWatchColorOption = {
            ...defaultColorOption,
            outerRing: 'rgb(249, 162, 83)',
            outerRingShadow: 'rgba(242, 144, 55, 0.85)',
            innerRing: 'rgba(82, 51, 23, 0.3)'
        };

        context.commit('setColor', option);
    },
    setRogueColorScheme(context: ActionContext<IWatchBaseState, any>): void {
        const option: IWatchColorOption = {
            ...defaultColorOption,
            borderRing: 'rgb(241, 49, 49)',
            borderRingShadow: 'rgba(111, 26, 14, 0.9)',
            outerRing: 'rgb(181, 53, 53)',
            outerRingShadow: 'rgba(181, 53, 53, 0.85)',
            innerRing: 'rgba(94, 51, 51, 0.4)',
            scale: 'rgb(239, 205, 84)',
            scaleSeparator: 'rgb(244, 39, 39)',
            dayOfWeek: 'rgb(186, 26, 26)',
            time: 'rgb(250, 221, 71)',
            batteryOutline: 'rgb(250, 221, 71)',
            batteryHigh: 'rgb(250, 221, 71)',
            menuBorder: 'rgba(209, 65, 65, 0.9)',
            menuBorderShadow: 'rgba(241, 49, 49, 0.85)'
        };

        context.commit('setColor', option);
    }
};

export const watchBase = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
