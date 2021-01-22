<template>
    <div class="agent-watch-container">
        <watch-base :state="state" @state:booted="onBooted()"></watch-base>
        <battery-display v-show="canDisplay" class="battery-display"></battery-display>
        <weather-display v-show="canDisplay" class="weather-display"></weather-display>
        <time-display v-show="canDisplay" class="time-display"></time-display>

        <img v-show="canDisplayAgentMode"
            class="logo"
            :class="{ 'logo-no-blink': !allowLogoBlink }"
            @click="isMenuOn = true"
            src="../../assets/images/shd_tech.jpg"
            draggable="false" />

        <session-count-down v-show="canDisplayRogueMode"
            class="session-count-down"
            :class="{ 'logo-no-blink': !allowLogoBlink }"
            @click="isMenuOn = true">
        </session-count-down>

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
import SessionCountDown from './SessionCountDown.vue';
import WatchBase from './WatchBase.vue';

@Options({
    components: {
        AccessMenu,
        BatteryDisplay,
        WeatherDisplay,
        TimeDisplay,
        SessionCountDown,
        WatchBase
    }
})
export default class AgentWatch extends Vue {
    public state = WatchState.AgentBooting;
    public allowLogoBlink = true;
    public isMenuOn = false;

    get canDisplay(): boolean {
        return this.canDisplayAgentMode || this.canDisplayRogueMode;
    }

    get canDisplayAgentMode(): boolean {
        return !this.isMenuOn && this.state === WatchState.AgentBooted;
    }

    get canDisplayRogueMode(): boolean {
        return !this.isMenuOn && this.state === WatchState.RogueBooted;
    }

    public onMenuClose(): void {
        this.isMenuOn = false;
        this.allowLogoBlink = false;
    }

    public onBooted(): void {
        this.state = WatchState.AgentBooted;
        store.dispatch('watchBase/setAgentColorScheme');
    }
}
</script>

<style lang="scss" scoped>
.agent-watch-container {
    $time-display-top: 58%;

    border-radius: 50%;

    .battery-display, .weather-display, .time-display {
        position: absolute;
        animation: revealContent 0.4s ease forwards;
        opacity: 0;
    }

    .battery-display {
        left: 21.5%;
        bottom: 57.25%;
        width: 15%;
        height: 7.5%;
    }

    .weather-display {
        right: 21.5%;
        bottom: $time-display-top;
    }

    .time-display {
        $width: 65%;
        $height: 34%;

        bottom: calc(57% - #{$height});
        right: calc(50% - #{$width} / 2);
        width: $width;
        height: $height;
    }

    .logo, .session-count-down {
        position: absolute;
        animation: blinkNormal 0.7s ease-in 0.2s forwards;
        opacity: 0;

        &:hover {
            cursor: pointer;
        }
    }

    .logo {
        $width: 38%;

        top: 5%;
        right: calc(50% - #{$width} / 2);
        width: $width;
    }

    .session-count-down {
        $dimension: 34%;

        top: 7.5%;
        right: calc(50% - #{$dimension} / 2);
        width: $dimension;
        height: $dimension;
    }

    .logo-no-blink {
        animation: revealContent 0.4s ease forwards;
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
