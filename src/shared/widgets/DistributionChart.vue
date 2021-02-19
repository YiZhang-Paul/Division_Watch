<template>
    <div class="distribution-chart-container" :title="tooltip">
        <div v-if="totalRendered === visibleGroups.length" class="embed-content">
            <slot></slot>
        </div>

        <percentage-chart class="percentage-chart"
            v-for="(group, index) of visibleGroups"
            :key="index"
            :style="{ transform: 'rotate(' + getRotation(index) + 'deg)' }"
            :color="isMonochrome ? 'rgba(5, 5, 5, 0.95)' : group.color"
            :percentage="getPercentage(index)"
            :renderDelay="renderDelay"
            :glowDelay="index * 2000"
            @chart:rendered="totalRendered++"
            @chart:mouseover="tooltip = group.total + ' ' + group.name"
            @chart:mouseout="tooltip = ''">
        </percentage-chart>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import { DistributionGroup } from '../../core/data-model/generic/distribution-group';

import PercentageChart from './PercentageChart.vue';

class DistributionChartProp {
    public groups = prop<DistributionGroup[]>({ default: [] });
    public renderDelay = prop<number>({ default: 3200 });
    public isMonochrome = prop<boolean>({ default: false });
}

@Options({
    components: { PercentageChart }
})
export default class DistributionChart extends Vue.with(DistributionChartProp) {
    public tooltip = '';
    public totalRendered = 0;

    get visibleGroups(): DistributionGroup[] {
        return this.groups.filter(_ => _.total);
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

    .embed-content {
        position: absolute;
        width: 75%;
        height: 75%;
        opacity: 0;
        animation: revealContent 0.25s ease forwards;
    }

    .percentage-chart {
        position: absolute;
        width: 100%;
        height: 100%;
    }
}
</style>
