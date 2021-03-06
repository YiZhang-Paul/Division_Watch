<template>
    <div class="distribution-chart-container" :class="{ monochrome: isMonochrome }" :title="tooltip">
        <div v-if="totalRendered === visibleGroups.length" class="embed-content">
            <slot></slot>
        </div>

        <div class="inner-placeholder"></div>
        <div v-if="!visibleGroups.length" class="outer-placeholder"></div>

        <template v-if="visibleGroups.length">
            <percentage-chart class="percentage-chart"
                v-for="(group, index) of visibleGroups"
                :key="index"
                :style="{ transform: 'rotate(' + getRotation(index) + 'deg)' }"
                :color="isMonochrome ? getTint(index) : group.color"
                :percentage="getPercentage(index)"
                :delay="delay"
                @chart:rendered="totalRendered++"
                @chart:mouseover="tooltip = group.total + ' ' + group.name"
                @chart:mouseout="tooltip = ''">
            </percentage-chart>
        </template>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import store from '../../store';
import { soundKey } from '../../store/sound/sound.state';
import { SoundOption } from '../../core/data-model/generic/sound-option';
// eslint-disable-next-line no-unused-vars
import { DistributionGroup } from '../../core/data-model/generic/distribution-group';
import { SoundType } from '../../core/enums/sound-type.enum';

import PercentageChart from './PercentageChart.vue';

class DistributionChartProp {
    public groups = prop<DistributionGroup[]>({ default: [] });
    public delay = prop<number>({ default: 3200 });
    public isMonochrome = prop<boolean>({ default: false });
}

@Options({
    watch: {
        visibleGroups(current: DistributionGroup[]): void {
            if (!current.length) {
                return;
            }

            setTimeout(() => {
                if (!this.stopSound) {
                    store.dispatch(`${soundKey}/playSound`, this.sound);
                }
            }, this.delay * 0.9);
        }
    },
    components: { PercentageChart }
})
export default class DistributionChart extends Vue.with(DistributionChartProp) {
    public readonly sound = new SoundOption('chart_fill', SoundType.UI);
    public tooltip = '';
    public totalRendered = 0;
    public stopSound = false;

    get visibleGroups(): DistributionGroup[] {
        return this.groups.filter(_ => _.total);
    }

    public beforeUnmount(): void {
        this.stopSound = true;
        store.dispatch(`${soundKey}/stopSound`, this.sound);
    }

    public getTint(index: number): string {
        let tint = [5, 5, 5];

        for (let i = 0; i < index; ++i) {
            tint = tint.map(_ => (255 - _) / 5 + _);
        }

        return `rgb(${tint.join(', ')})`;
    }

    public getRotation(index: number): number {
        const indexes = new Array(index).fill(0);
        const percentages = indexes.map((_, i) => this.getPercentage(i));

        return 3.6 * percentages.reduce((total, _) => total + _, 0);
    }

    public getPercentage(index: number): number {
        const grandTotal = this.visibleGroups.reduce((total, _) => total + _.total, 0);

        return Math.floor(this.visibleGroups[index].total / grandTotal * 100 * 10) / 10;
    }
}
</script>

<style lang="scss" scoped>
.distribution-chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    height: 100%;
    pointer-events: none;

    &.monochrome {

        .inner-placeholder {
            border: 1px solid rgba(30, 30, 30, 0.65);
        }

        .outer-placeholder {
            border: 4px solid rgba(30, 30, 30, 0.75);
        }
    }

    .embed-content {
        position: absolute;
        width: 75%;
        height: 75%;
        opacity: 0;
        animation: revealContent 0.25s ease forwards;
    }

    .outer-placeholder, .inner-placeholder {
        position: absolute;
        border-radius: 50%;
        transition: border 0.25s;
        opacity: 0;
        animation: revealContent 0.2s ease 0.5s forwards;
    }

    .outer-placeholder {
        width: 90%;
        height: 90%;
        border: 4px solid rgba(200, 200, 200, 0.15);
    }

    .inner-placeholder {
        width: 86.5%;
        height: 86.5%;
        border: 1px solid rgba(200, 200, 200, 0.35);
    }

    .percentage-chart {
        position: absolute;
        width: 100%;
        height: 100%;
    }
}
</style>
