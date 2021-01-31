<template>
    <div class="distribution-chart-container">
        <div class="embed-content" :style="{ opacity: rendered === groups.length ? 1 : 0 }">
            <slot></slot>
        </div>

        <percentage-chart class="percentage-chart"
            v-for="(group, index) of groups"
            :key="index"
            :style="{ transform: 'rotate(' + getRotation(index) + 'deg)' }"
            :useSimpleView="!group.highlight"
            :color="group.color"
            :percentage="getPercentage(index)"
            :delay="3200"
            @chart:rendered="rendered++">
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
}

@Options({
    components: { PercentageChart }
})
export default class DistributionChart extends Vue.with(DistributionChartProp) {
    public rendered = 0;

    public getRotation(index: number): number {
        const indexes = new Array(index).fill(0);
        const percentages = indexes.map((_, i) => this.getPercentage(i));

        return 3.6 * percentages.reduce((total, _) => total + _, 0);
    }

    public getPercentage(index: number): number {
        const grandTotal = this.groups.reduce((total, _) => total + _.total, 0);

        return Math.floor(this.groups[index].total / grandTotal * 100 * 10) / 10;
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

    .embed-content {
        position: absolute;
        width: 75%;
        height: 75%;
        opacity: 0;
        transition: opacity 0.3s;
    }

    .percentage-chart {
        position: absolute;
        width: 100%;
        height: 100%;
    }
}
</style>
