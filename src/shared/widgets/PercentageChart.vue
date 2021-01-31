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

        <circle class="handle" cx="95" cy="50" :r="useSimpleView ? 1.5 : 2" :style="handleStyle" fill="rgb(255, 255, 255)" />
    </svg>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

class PercentageChartProp {
    public useSimpleView = prop<boolean>({ default: false });
    public color = prop<string>({ default: 'rgb(255, 255, 255)' });
    public percentage = prop<number>({ default: 100 });
    public renderDelay = prop<number>({ default: 3200 });
    public glowDelay = prop<number>({ default: 3000 });
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
        const percentage = this.dasharray / 100 * (100 - this.percentage + 8.2 / 3.6);

        return {
            'stroke-width': this.useSimpleView ? 1.25 : 2.25,
            'stroke-dasharray': this.dasharray,
            'stroke-dashoffset': this.canAnimate ? percentage : this.dasharray
        };
    }

    get handleStyle(): { [key: string]: string | null } {
        const degrees = 360 / 100 * this.percentage;

        return {
            'animation-delay': `${this.glowDelay / 1000}s`,
            transform: this.canAnimate ? `rotate(${degrees}deg)` : null
        };
    }

    public mounted(): void {
        setTimeout(() => this.canAnimate = true, this.renderDelay);
        const element = document.querySelector('.handle');
        element?.addEventListener('transitionend', () => this.$emit('chart:rendered'));
    }
}
</script>

<style lang="scss" scoped>
.percentage-chart-container {
    $transition-time: 0.8s;

    pointer-events: none;
    transition: stroke-dashoffset $transition-time;

    .bar, .handle {
        transform-origin: 50% 50%;
    }

    .bar {
        pointer-events: auto;
        opacity: 0.75;
        transform: rotate(4deg);
        transition: opacity 0.3s;

        &:hover {
            opacity: 1;
        }
    }

    .handle {
        transition: transform $transition-time;
        animation: glow 5s ease-in-out forwards infinite;
    }

    @keyframes glow {
        0% {
            fill: rgb(255, 255, 255);
        }
        10% {
            fill: rgb(255, 50, 50);
        }
        20% {
            fill: rgb(255, 255, 255);
        }
        100% {
            fill: rgb(255, 255, 255);
        }
    }
}
</style>
