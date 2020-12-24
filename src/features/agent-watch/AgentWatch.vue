<template>
    <div class="agent-watch-container">
        <watch-base></watch-base>

        <template v-if="!isMenuOn">
            <battery-display class="battery-display"></battery-display>
            <weather-display class="weather-display"></weather-display>
            <time-display class="time-display"></time-display>
            <img class="logo" @click="openMenu()" src="../../assets/images/shd_tech.jpg" draggable="false" />
        </template>

        <div v-if="isMenuOn" class="menu-overlay">
            <div class="option-name"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import BatteryDisplay from '../../shared/BatteryDisplay.vue';
import WeatherDisplay from '../../shared/WeatherDisplay.vue';
import TimeDisplay from '../../shared/TimeDisplay.vue';
import WatchBase from '../../shared/WatchBase.vue';

@Options({
    components: {
        BatteryDisplay,
        WeatherDisplay,
        TimeDisplay,
        WatchBase
    }
})
export default class AgentWatch extends Vue {
    public isMenuOn = false;

    public openMenu(): void {
        this.isMenuOn = true;
    }
}
</script>

<style lang="scss" scoped>
.agent-watch-container {
    $time-display-top: 58%;

    border-radius: 50%;

    .battery-display, .weather-display, .time-display {
        position: absolute;
    }

    .battery-display, .weather-display {
        bottom: $time-display-top;
    }

    .battery-display {
        left: 21.5%;
        width: 13%;
        height: 6%;
    }

    .weather-display {
        right: 25%;
    }

    .time-display {
        $width: 65%;
        $height: 34%;

        bottom: calc(#{$time-display-top} - #{$height});
        right: calc(50% - #{$width} / 2);
        width: $width;
        height: $height;
    }

    .logo {
        $width: 39.5%;

        position: absolute;
        top: 5%;
        right: calc(50% - #{$width} / 2);
        width: $width;

        &:hover {
            cursor: pointer;
        }
    }

    .menu-overlay {
        $dimension: 76%;

        position: absolute;
        top: calc(50% - #{$dimension} / 2);
        left: calc(50% - #{$dimension} / 2);
        width: calc(#{$dimension} - 4px);
        height: calc(#{$dimension} - 4px);
        background: linear-gradient(to bottom, rgba(121, 117, 131, 0.33), rgba(54, 53, 103, 0.33));
        background-color: rgba(49, 48, 54, 0.85);
        border: 2px solid rgba(218, 220, 69, 0.9);
        border-radius: 50%;
        opacity: 0.95;

        .option-name {
            $dimension: 60%;

            position: absolute;
            top: calc(50% - #{$dimension} / 2);
            left: calc(50% - #{$dimension} / 2);
            width: calc(#{$dimension} - 4px);
            height: calc(#{$dimension} - 4px);
            background: linear-gradient(to bottom, rgba(121, 117, 131, 0.33), rgba(54, 53, 103, 0.33));
            background-color: rgba(49, 48, 54, 0.85);
            border: 2px solid rgba(218, 220, 69, 0.9);
            border-radius: 50%;
            box-shadow: 0 0 4px 1px rgba(227, 94, 19, 0.75);
            opacity: 0.95;
        }
    }
}
</style>
