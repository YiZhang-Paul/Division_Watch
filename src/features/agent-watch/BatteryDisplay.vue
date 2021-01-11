<template>
    <div class="battery-display-container">
        <div class="battery-indicator" :style="{ border: '1px solid ' + colorOption.batteryOutline }">
            <div :style="indicatorStyle"></div>
            <div :style="{ 'background-color': colorOption.batteryOutline }"></div>
        </div>

        <div class="level">
            <span>88</span>
            <span>{{ level }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

import store from '../../store';
// eslint-disable-next-line no-unused-vars
import { IWatchColorOption } from '../../store/watch-base/watch-base.state';
import { TimeUtility } from '../../core/utilities/time/time.utility';

const browserBattery = require('browser-battery');

export default class BatteryDisplay extends Vue {
    public level = '00';

    get colorOption(): IWatchColorOption {
        return store.getters['watchBase/colorOption'];
    }

    get indicatorStyle(): { [key: string]: string } {
        const level = Number(this.level);

        return {
            width: `${level}%`,
            'background-color': level > 20 ? this.colorOption.batteryHigh: 'red'
        };
    }

    public async created(): Promise<void> {
        const battery = await browserBattery();
        battery.onlevelchange = () => this.setLevel(battery.level);
        this.setLevel(battery.level);
    }

    private setLevel(level: number): void {
        this.level = TimeUtility.prependZero(Math.min(99, level * 100));
    }
}
</script>

<style lang="scss" scoped>
.battery-display-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 100%;

    .battery-indicator {
        position: relative;
        width: 40%;
        height: 45%;
        border-radius: 2px;

        & > div:first-of-type {
            height: 100%;
        }

        & > div:last-of-type {
            $tip-width: 4%;
            $indicator-height: 40%;

            position: absolute;
            top: calc(50% - #{$indicator-height} / 2);
            right: calc(-#{$tip-width} - 1px);
            width: $tip-width;
            height: $indicator-height;
        }
    }

    .level {
        position: relative;
        font-family: 'Digital Numbers';
        color: rgb(255, 255, 255);

        & > span:first-of-type {
            position: absolute;
            color: rgba(85, 85, 85, 0.3);
        }
    }
}
</style>
