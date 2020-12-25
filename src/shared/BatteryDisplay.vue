<template>
    <div class="battery-display-container">
        <div class="battery-indicator">
            <div :style="indicatorStyle"></div>
            <div></div>
        </div>

        <div class="level">
            <span>88</span>
            <span>{{ level }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

import { TimeUtility } from '../core/utilities/time/time.utility';

const browserBattery = require('browser-battery');

export default class BatteryDisplay extends Vue {
    public level = '00';

    get indicatorStyle(): { [key: string]: string } {
        const level = Number(this.level);

        return {
            width: `${level}%`,
            'background-color': level > 20 ? 'lime': 'red'
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
        $border-color: rgba(255, 255, 255, 0.5);

        position: relative;
        width: 40%;
        height: 45%;
        border: 1px solid $border-color;
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
            background-color: $border-color;
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
