<template>
    <svg class="percentage-chart-container" width="100" height="100" viewBox="0 0 100 100" :style="chartStyle">
        <circle class="bar" cx="50" cy="50" r="45" fill="none" :stroke="color" />
        <circle cx="95" cy="50" r="2" fill="rgb(255, 255, 255)" />
        <circle class="bar-end" cx="95" cy="50" r="2" fill="rgb(255, 255, 255)" :style="barEndStyle" />
    </svg>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

class PercentageChartProp {
    public color = prop<string>({ default: 'rgb(255, 255, 255)' });
    public percentage = prop<number>({ default: 100 });
    public delay = prop<number>({ default: 3500 });
}

@Options({
    emits: ['chart:rendered']
})
export default class PercentageChart extends Vue.with(PercentageChartProp) {
    public canAnimate = false;

    get chartStyle(): { [key: string]: number } {
        const percentage = 2.83 * (100 - this.percentage + 7 / 3.6);

        return { 'stroke-dashoffset': this.canAnimate ? percentage : 283 };
    }

    get barEndStyle(): { [key: string]: string | null } {
        const degrees = 360 / 100 * this.percentage;

        return { transform: this.canAnimate ? `rotate(${degrees}deg)` : null };
    }

    public mounted(): void {
        setTimeout(() => this.canAnimate = true, this.delay);
        const element = document.querySelector('.bar-end');
        element?.addEventListener('transitionend', () => this.$emit('chart:rendered'));
    }
}
</script>

<style lang="scss" scoped>
.percentage-chart-container {
    $transition-time: 0.8s;

    stroke-width: 3;
    stroke-dasharray: 283;
    stroke-dashoffset: 283;
    transition: stroke-dashoffset $transition-time;

    .bar, .bar-end {
        transform-origin: 50% 50%;
    }

    .bar {
        opacity: 0.75;
        transform: rotate(3.5deg);
        transition: opacity 0.3s;

        &:hover {
            opacity: 1;
        }
    }

    .bar-end {
        transition: transform $transition-time;
    }
}
</style>
