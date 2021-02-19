<template>
    <svg class="percentage-chart-container" width="100" height="100" viewBox="0 0 100 100" :style="chartStyle">
        <circle class="bar"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            :stroke="color"
            @mouseover="$emit('chart:mouseover')"
            @mouseout="$emit('chart:mouseout')" />

        <circle class="handle-1" cx="95" cy="50" :r="1.15" :style="handleStyle" fill="rgb(255, 255, 255)" />
        <circle class="handle-2" cx="95" cy="50" :r="1.15" fill="rgb(255, 255, 255)" />
    </svg>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

class PercentageChartProp {
    public color = prop<string>({ default: 'rgb(255, 255, 255)' });
    public percentage = prop<number>({ default: 100 });
    public delay = prop<number>({ default: 1500 });
}

@Options({
    emits: [
        'chart:rendered',
        'chart:mouseover',
        'chart:mouseout'
    ]
})
export default class PercentageChart extends Vue.with(PercentageChartProp) {
    public canAnimate = false;
    private readonly dasharray = 283;

    get chartStyle(): { [key: string]: number } {
        const percentage = this.dasharray / 100 * (100 - this.percentage);

        return {
            'stroke-width': 1.55,
            'stroke-dasharray': this.dasharray,
            'stroke-dashoffset': this.canAnimate ? percentage : this.dasharray
        };
    }

    get handleStyle(): { [key: string]: string | null } {
        return { transform: this.canAnimate ? `rotate(${this.percentage / 100 * 360}deg)` : null };
    }

    public mounted(): void {
        setTimeout(() => this.canAnimate = true, this.delay);
        const element = document.querySelector('.handle-1');
        element?.addEventListener('transitionend', () => this.$emit('chart:rendered'));
    }
}
</script>

<style lang="scss" scoped>
.percentage-chart-container {
    $transition-time: 0.8s;

    pointer-events: none;
    transition: stroke-dashoffset $transition-time;

    .bar, .handle-1, .handle-2 {
        transform-origin: 50% 50%;
    }

    .bar {
        pointer-events: auto;
        transition: stroke-width 0.25s;

        &:hover {
            stroke-width: 3;
        }

        &:hover ~ .handle-1, &:hover ~ .handle-2 {
            r: 2;
        }
    }

    .handle-1, .handle-2 {
        transition: transform $transition-time, stroke-width 0.25s, r 0.25s;
    }
}
</style>
