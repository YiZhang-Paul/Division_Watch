<template>
    <div class="agent-watch-container">
        <watch-base></watch-base>
        <battery-display class="battery-display"></battery-display>
        <weather-display class="weather-display"></weather-display>
        <time-display class="time-display"></time-display>
        <img class="logo" src="../../assets/images/shd_tech.jpg" draggable="false" />
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
export default class AgentWatch extends Vue { }
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
        right: 21.5%;
        width: 12%;
        height: 12.5%;
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
    }
}
</style>
