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

export interface IWatchBaseState {
    color: IWatchColorOption;
}

const state = () => ({
    color: {
        background: 'rgb(30, 30, 30)',
        borderRing: 'rgb(243, 245, 108)',
        borderRingShadow: 'rgba(227, 94, 19, 0.95)',
        outerRing: 'rgb(249, 162, 83)',
        outerRingShadow: 'rgba(242, 144, 55, 0.85)',
        innerRing: 'rgba(82, 51, 23, 0.3)',
        innerRingShadow: 'rgba(0, 0, 0, 0)',
        scale: 'rgb(250, 137, 31)',
        scaleGuard: 'rgb(148, 75, 8)'
    }
});

const getters = {
    color: (state: IWatchBaseState): IWatchColorOption => state.color
};

export const watchBase = {
    namespaced: true,
    state,
    getters
};
