<template>
    <div class="agent-watch-container">
        <watch-base></watch-base>
        <battery-display v-show="!isMenuOn" class="battery-display"></battery-display>
        <weather-display v-show="!isMenuOn" class="weather-display"></weather-display>
        <time-display v-show="!isMenuOn" class="time-display"></time-display>
        <img v-show="!isMenuOn" class="logo" @click="isMenuOn = true" src="../../assets/images/shd_tech.jpg" draggable="false" />
        <access-menu v-if="isMenuOn" class="access-menu" @menu:close="isMenuOn = false"></access-menu>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import AccessMenu from './AccessMenu.vue';
import BatteryDisplay from './BatteryDisplay.vue';
import WeatherDisplay from './WeatherDisplay.vue';
import TimeDisplay from './TimeDisplay.vue';
import WatchBase from './WatchBase.vue';

@Options({
    components: {
        AccessMenu,
        BatteryDisplay,
        WeatherDisplay,
        TimeDisplay,
        WatchBase
    }
})
export default class AgentWatch extends Vue {
    public isMenuOn = false;
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

    .access-menu {
        $overlay-dimension: 76%;

        position: absolute;
        top: calc(50% - #{$overlay-dimension} / 2);
        left: calc(50% - #{$overlay-dimension} / 2);
        width: calc(#{$overlay-dimension} - 4px);
        height: calc(#{$overlay-dimension} - 4px);
    }
}
</style>
