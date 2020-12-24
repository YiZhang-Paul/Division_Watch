import { ValueChange } from '../../core/data-model/value-change';
import { RangeChange } from '../../core/data-model/range-change';

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
    borderRing: ValueChange[];
    outerRing: ValueChange[];
    innerRing: ValueChange[];
    scale: ValueChange[];
    scaleGuard: ValueChange[];
}

interface IBlurAnimation {
    background: RangeChange[];
    borderRing: RangeChange[];
    outerRing: RangeChange[];
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

export const watchBase = {
    namespaced: true,
    state,
    getters
};
