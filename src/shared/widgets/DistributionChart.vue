<template>
    <div class="distribution-chart-container">
        <div>
            <slot></slot>
        </div>

        <percentage-chart class="percentage-chart"
            v-for="(group, index) of groups"
            :key="index"
            :color="group.color"
            :percentage="getPercentage(group)"
            :delay="3200">
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

    public getPercentage(group: DistributionGroup): number {
        const grandTotal = this.groups.reduce((total, _) => total + _.total, 0);

        return Math.floor(group.total / grandTotal * 100 * 10) / 10;
    }
}
</script>

<style lang="scss" scoped>
.distribution-chart-container {
    position: relative;
    width: 100%;
    height: 100%;

    .percentage-chart {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        animation: revealContent 0.3s ease-in 0.25s forwards;
    }
}
</style>
