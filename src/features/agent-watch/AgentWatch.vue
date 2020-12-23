<template>
    <div class="agent-watch-container">
        <watch-base></watch-base>
        <battery-display class="battery-display"></battery-display>
        <time-display class="time-display"></time-display>
        <img class="logo" src="../../assets/images/shd_tech.jpg" draggable="false" />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import BatteryDisplay from '../../shared/BatteryDisplay.vue';
import TimeDisplay from '../../shared/TimeDisplay.vue';
import WatchBase from '../../shared/WatchBase.vue';

@Options({
    components: {
        BatteryDisplay,
        TimeDisplay,
        WatchBase
    }
})
export default class AgentWatch extends Vue { }
</script>

<style lang="scss" scoped>
.agent-watch-container {
    $time-display-top: 59%;

    border-radius: 50%;

    .battery-display, .time-display {
        position: absolute;
    }

    .battery-display {
        left: 21.5%;
        bottom: $time-display-top;
        width: 13%;
        height: 6%;
    }

    .time-display {
        $width: 65%;
        $height: 36%;

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
