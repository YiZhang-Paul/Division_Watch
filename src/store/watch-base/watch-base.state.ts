interface IWatchColorOption {
    background: string;
    borderRing: string;
    borderRingShadow: string;
    outerRing: string;
    outerRingShadow: string;
    innerRing: string;
    innerRingShadow: string;
    scale: string;
    scaleGuard: string;
}

interface IAngleAnimation {
    borderRing: { change: number; duration: number }[];
    outerRing: { change: number; duration: number }[];
    innerRing: { change: number; duration: number }[];
    scale: { change: number; duration: number }[];
    scaleGuard: { change: number; duration: number }[];
}

interface IBlurAnimation {
    background: { start: number; end: number; duration: number }[];
    borderRing: { start: number; end: number; duration: number }[];
    outerRing: { start: number; end: number; duration: number }[];
}

export interface IWatchBaseState {
    colorOption: IWatchColorOption;
    angleAnimation: IAngleAnimation;
    blurAnimation: IBlurAnimation;
}

const state = () => ({
    colorOption: {
        background: 'rgb(30, 30, 30)',
        borderRing: 'rgb(243, 245, 108)',
        borderRingShadow: 'rgba(227, 94, 19, 0.95)',
        outerRing: 'rgb(249, 162, 83)',
        outerRingShadow: 'rgba(242, 144, 55, 0.85)',
        innerRing: 'rgba(82, 51, 23, 0.3)',
        innerRingShadow: 'rgba(0, 0, 0, 0)',
        scale: 'rgb(250, 137, 31)',
        scaleGuard: 'rgb(148, 75, 8)'
    },
    angleAnimation: {
        borderRing: [{ change: 360, duration: 60000 }],
        outerRing: [{ change: -120, duration: 8500 }, { change: 180, duration: 1500 }],
        innerRing: [{ change: 360, duration: 12000 }],
        scale: [{ change: 0, duration: 0 }],
        scaleGuard: [{ change: 120, duration: 8500 }, { change: -180, duration: 1500 }]
    },
    blurAnimation: {
        background: [{ start: 8, end: 20, duration: 3000 }, { start: 20, end: 8, duration: 3000 }],
        borderRing: [{ start: 1, end: 3, duration: 3000 }, { start: 3, end: 1, duration: 3000 }],
        outerRing: [{ start: 3, end: 12, duration: 3000 }, { start: 12, end: 3, duration: 3000 }]
    }
});

const getters = {
    colorOption: (state: IWatchBaseState): IWatchColorOption => state.colorOption,
    angleAnimation: (state: IWatchBaseState): IAngleAnimation => state.angleAnimation,
    blurAnimation: (state: IWatchBaseState): IBlurAnimation => state.blurAnimation
};

export const watchBase = {
    namespaced: true,
    state,
    getters
};
