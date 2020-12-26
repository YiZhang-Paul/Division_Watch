<template>
    <div class="agent-watch-container">
        <watch-base :state="state" @state:booted="onBooted()"></watch-base>
        <battery-display v-show="canDisplay" class="battery-display"></battery-display>
        <weather-display v-show="canDisplay" class="weather-display"></weather-display>
        <time-display v-show="canDisplay" class="time-display"></time-display>

        <img v-show="canDisplay"
            class="logo"
            :class="{ 'logo-no-blink': !allowLogoBlink }"
            @click="isMenuOn = true"
            src="../../assets/images/shd_tech.jpg"
            draggable="false" />

        <access-menu v-if="isMenuOn" class="access-menu" @menu:close="onMenuClose()"></access-menu>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../store';
import { WatchState } from '../../core/enums/watch-state.enum';

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
    public state = WatchState.Booting;
    public allowLogoBlink = true;
    public isMenuOn = false;

    get canDisplay(): boolean {
        return !this.isMenuOn && this.state === WatchState.Booted;
    }

    public onMenuClose(): void {
        this.isMenuOn = false;
        this.allowLogoBlink = false;
    }

    public onBooted(): void {
        this.state = WatchState.Booted;
        store.dispatch('watchBase/setNormalColorScheme');
    }
}
</script>

<style lang="scss" scoped>
.agent-watch-container {
    $time-display-top: 58%;

    border-radius: 50%;

    .battery-display, .weather-display, .time-display {
        position: absolute;
        animation: loadWatchData 0.4s ease forwards;
        opacity: 0;
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
        animation: loadLogo 0.7s ease-in 0.2s forwards;
        opacity: 0;

        &:hover {
            cursor: pointer;
        }
    }

    .logo-no-blink {
        animation: loadWatchData 0.4s ease forwards;
    }

    .access-menu {
        $overlay-dimension: 76%;

        position: absolute;
        top: calc(50% - #{$overlay-dimension} / 2);
        left: calc(50% - #{$overlay-dimension} / 2);
        width: calc(#{$overlay-dimension} - 4px);
        height: calc(#{$overlay-dimension} - 4px);
    }

    @keyframes loadWatchData {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes loadLogo {
        0% {
            opacity: 0;
        }
        10% {
            opacity: 0.1;
        }
        11% {
            opacity: 1;
        }
        30% {
            opacity: 1;
        }
        31% {
            opacity: 0.1;
        }
        50% {
            opacity: 0.1;
        }
        51% {
            opacity: 1;
        }
        70% {
            opacity: 1;
        }
        71% {
            opacity: 0.1;
        }
        75% {
            opacity: 1;
        }
        100% {
            opacity: 1;
        }
    }
}
</style>
