<template>
    <div class="battery-display-container">{{ level }}</div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

const browserBattery = require('browser-battery');

export default class BatteryDisplay extends Vue {
    public level = 0;

    public async created(): Promise<void> {
        const battery = await browserBattery();
        battery.onlevelchange = () => this.level = battery.level;
        this.level = battery.level;
    }
}
</script>

<style lang="scss" scoped>
.battery-display-container {
    width: 100%;
    height: 100%;
    background-color: red;
}
</style>
