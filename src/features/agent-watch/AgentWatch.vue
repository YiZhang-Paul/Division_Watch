<template>
    <div class="agent-watch-container" :class="{ closing: isClosing }">
        <watch-base :state="state" @state:booted="onBooted()"></watch-base>
        <battery-display v-show="canDisplay" class="battery-display"></battery-display>
        <weather-display v-show="canDisplay" class="weather-display"></weather-display>
        <time-display v-show="canDisplay" class="time-display"></time-display>

        <img v-show="canDisplayAgentMode"
            class="logo"
            :class="{ 'no-blink': !canBlinkLogo }"
            @mouseenter="onOptionHover()"
            @click="isMenuOn = true"
            src="../../assets/images/shd_tech.jpg"
            draggable="false" />

        <session-display v-show="canDisplayRogueMode"
            class="session-display"
            :class="{ 'no-blink': !canBlinkLogo }"
            @click="isMenuOn = true">
        </session-display>

        <access-menu v-if="isMenuOn"
            class="access-menu"
            @menu:select="onMenuSelect($event)"
            @menu:close="onMenuClose()">
        </access-menu>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import store from '../../store';
import { mainViewKey } from '../../store/main-view/main-view.state';
import { soundKey } from '../../store/sound/sound.state';
import { watchBaseKey } from '../../store/watch-base/watch-base.state';
import { SoundOption } from '../../core/data-model/generic/sound-option';
import { WatchState } from '../../core/enums/watch-state.enum';
import { SoundType } from '../../core/enums/sound-type.enum';
import { WatchMenuOption } from '../../core/enums/watch-menu-option.enum';
import { ViewOption } from '../../core/enums/view-option.enum';

import WatchBase from './WatchBase.vue';
import AccessMenu from './AccessMenu.vue';
import SessionDisplay from './displays/SessionDisplay.vue';
import BatteryDisplay from './displays/BatteryDisplay.vue';
import WeatherDisplay from './displays/WeatherDisplay.vue';
import TimeDisplay from './displays/TimeDisplay.vue';

class AgentWatchProp {
    public isRogue = prop<boolean>({ default: false });
}

@Options({
    components: {
        WatchBase,
        AccessMenu,
        SessionDisplay,
        BatteryDisplay,
        WeatherDisplay,
        TimeDisplay
    }
})
export default class AgentWatch extends Vue.with(AgentWatchProp) {
    public state = WatchState.AgentBooting;
    public canBlinkLogo = true;
    public isMenuOn = false;
    public isClosing = false;

    get canDisplay(): boolean {
        return this.canDisplayAgentMode || this.canDisplayRogueMode;
    }

    get canDisplayAgentMode(): boolean {
        return !this.isMenuOn && this.state === WatchState.AgentBooted;
    }

    get canDisplayRogueMode(): boolean {
        return !this.isMenuOn && this.state === WatchState.RogueBooted;
    }

    public onBooted(): void {
        this.state = this.isRogue ? WatchState.RogueBooted : WatchState.AgentBooted;
        store.dispatch(`${watchBaseKey}/set${this.isRogue ? 'Rogue' : 'Agent'}ColorScheme`);
        store.dispatch(`${soundKey}/playSound`, new SoundOption('clock_tick_slow', SoundType.Clock, true));
    }

    public onOptionHover(): void {
        store.dispatch(`${soundKey}/playSound`, new SoundOption('button_hover', SoundType.UI));
    }

    public onMenuSelect(option: WatchMenuOption): void {
        if (option === WatchMenuOption.Setting) {
            store.commit(`${mainViewKey}/setActiveView`, ViewOption.Settings);
        }
        else if (option === WatchMenuOption.MainMenu) {
            store.commit(`${mainViewKey}/setActiveView`, ViewOption.MainMenuAnimated);
        }
        else if (option === WatchMenuOption.ShutDown) {
            this.isClosing = true;
            store.dispatch(`${soundKey}/mute`);

            setTimeout(() => {
                this.state = WatchState.Closing;
                setTimeout(() => (window as any).ipcRenderer?.send('watch-shutdown'), 500);
            }, 700);
        }

        this.onMenuClose();
    }

    public onMenuClose(): void {
        this.isMenuOn = false;
        this.canBlinkLogo = false;
    }
}
</script>

<style lang="scss" scoped>
.agent-watch-container {

    border-radius: 50%;

    &.closing {

        .battery-display,
        .weather-display,
        .time-display,
        .session-display,
        .logo {
            pointer-events: none;
            animation: revealContent 0.6s ease forwards reverse;
        }
    }

    .battery-display, .weather-display, .time-display {
        position: absolute;
        opacity: 0;
        animation: revealContent 0.4s ease forwards;
    }

    .battery-display {
        left: 21.5%;
        bottom: 57.25%;
        width: 15%;
        height: 7.5%;
    }

    .weather-display {
        right: 21.5%;
        bottom: 57.5%;
    }

    .time-display {
        $width: 65%;
        $height: 30%;

        bottom: calc(55% - #{$height});
        right: calc(50% - #{$width} / 2);
        width: $width;
        height: $height;
    }

    .logo, .session-display {
        position: absolute;
        opacity: 0;
        animation: blinkNormal 0.7s ease-in 0.2s forwards;

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

    .session-display {
        $dimension: 34%;

        top: 7.5%;
        right: calc(50% - #{$dimension} / 2);
        width: $dimension;
        height: $dimension;
    }

    .no-blink {
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
