<template>
    <div class="agent-watch-container">
        <watch-base></watch-base>
        <time-display class="time-display"></time-display>
        <img class="logo" src="../../assets/images/shd_tech.jpg" draggable="false" />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import TimeDisplay from '../../shared/TimeDisplay.vue';
import WatchBase from '../../shared/WatchBase.vue';

@Options({
    components: {
        TimeDisplay,
        WatchBase
    }
})
export default class AgentWatch extends Vue { }
</script>

<style lang="scss" scoped>
.agent-watch-container {
    border-radius: 50%;

    .logo {
        $width: 37%;

        position: absolute;
        top: 5%;
        right: calc(50% - #{$width} / 2);
        width: $width;
    }

    .time-display {
        $width: 65%;
        $height: 36%;

        position: absolute;
        bottom: 24%;
        right: calc(50% - #{$width} / 2);
        width: $width;
        height: $height;
    }
}
</style>
