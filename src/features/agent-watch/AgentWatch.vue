<template>
    <div class="agent-watch-container">
        <watch-base></watch-base>

        <template v-if="!isMenuOn">
            <battery-display class="battery-display"></battery-display>
            <weather-display class="weather-display"></weather-display>
            <time-display class="time-display"></time-display>
            <img class="logo" @click="isMenuOn = true" src="../../assets/images/shd_tech.jpg" draggable="false" />
        </template>

        <div v-if="isMenuOn" class="menu-overlay glass-panel">
            <div v-for="option of options"
                class="option-button"
                :style="{ transform: 'rotate(' + option.angle + 'deg)', 'transform-origin': '100% 50%' }"
                :key="option.name">

                <button class="glass-panel"
                    :style="{ transform: 'rotate(' + -option.angle + 'deg)', color: isOptionsDisabled ? 'grey' : option.color }"
                    @mouseover="activeOption = option.name"
                    @mouseout="activeOption = ''"
                    @click="$emit('menu:select', option.name)">

                    <power-standby v-if="option.name === 'On/Off'" />
                    <play v-if="option.name === 'Start'" />
                    <timer-sand v-if="option.name === 'Tasks'" />
                    <palette-swatch v-if="option.name === 'Planner'" />
                    <inbox-multiple v-if="option.name === 'Backlog'" />
                    <finance v-if="option.name === 'Stats'" />
                    <cog v-if="option.name === 'Settings'" />
                </button>
            </div>

            <div class="option-name glass-panel">
                <span v-if="activeOption">{{ activeOption }}</span>

                <close-circle v-if="!activeOption"
                    class="close-menu"
                    @mouseover="isOptionsDisabled = true"
                    @mouseout="isOptionsDisabled = false"
                    @click="closeMenu()" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Cog, CloseCircle, Finance, InboxMultiple, PowerStandby, Play, PaletteSwatch, TimerSand } from 'mdue';

import BatteryDisplay from '../../shared/BatteryDisplay.vue';
import WeatherDisplay from '../../shared/WeatherDisplay.vue';
import TimeDisplay from '../../shared/TimeDisplay.vue';
import WatchBase from '../../shared/WatchBase.vue';

@Options({
    components: {
        Cog,
        CloseCircle,
        Finance,
        InboxMultiple,
        PowerStandby,
        Play,
        PaletteSwatch,
        TimerSand,
        BatteryDisplay,
        WeatherDisplay,
        TimeDisplay,
        WatchBase
    },
    emits: ['menu:select']
})
export default class AgentWatch extends Vue {
    public options = [
        { name: 'On/Off', angle: 51, color: 'rgb(24, 238, 20)' },
        { name: 'Start', angle: 131, color: 'rgb(24, 238, 20)' },
        { name: 'Tasks', angle: 211, color: 'rgb(238, 255, 133)' },
        { name: 'Planner', angle: 251, color: 'rgb(238, 123, 107)' },
        { name: 'Backlog', angle: 291, color: 'rgb(255, 9, 9)' },
        { name: 'Stats', angle: 331, color: 'rgb(33, 188, 254)' },
        { name: 'Settings', angle: 371, color: 'rgb(255, 255, 255)' }
    ];

    public activeOption = '';
    public isMenuOn = false;
    public isOptionsDisabled = false;

    public closeMenu(): void {
        this.isMenuOn = false;
        this.isOptionsDisabled = false;
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

    .glass-panel {
        background: linear-gradient(to bottom, rgba(121, 117, 131, 0.33), rgba(54, 53, 103, 0.33));
        background-color: rgba(18, 18, 19, 0.95);
        box-shadow: 0 0 4px 1px rgba(227, 94, 19, 0.75);
        border: 2px solid rgba(218, 220, 69, 0.9);
        border-radius: 50%;
        opacity: 0.95;
    }

    .menu-overlay {
        $overlay-dimension: 76%;
        $option-name-dimension: 60%;

        position: absolute;
        top: calc(50% - #{$overlay-dimension} / 2);
        left: calc(50% - #{$overlay-dimension} / 2);
        width: calc(#{$overlay-dimension} - 4px);
        height: calc(#{$overlay-dimension} - 4px);
        color: rgb(255, 255, 255);
        font-family: 'Bruno Ace';

        .close-menu {
            font-size: 2.5em;
            color: rgb(255, 0, 0);
            transition: color 0.15s, font-size 0.15s;

            &:hover {
                cursor: pointer;
                font-size: 3em;
                color: rgb(240, 44, 44);
            }
        }

        .option-name {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: calc(50% - #{$option-name-dimension} / 2);
            left: calc(50% - #{$option-name-dimension} / 2);
            width: calc(#{$option-name-dimension} - 4px);
            height: calc(#{$option-name-dimension} - 4px);
            font-size: 2em;
        }

        .option-button {
            position: absolute;
            top: 49.5%;
            left: 0;
            width: 50%;
            height: 1%;
        }

        button {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            bottom: calc((#{$overlay-dimension} - #{$option-name-dimension}) * -50);
            left: 4%;
            width: calc((#{$overlay-dimension} - #{$option-name-dimension}) * 2);
            height: calc((#{$overlay-dimension} - #{$option-name-dimension}) * 100);
            outline: none;
            font-size: 2em;
            transition: border 0.3s, box-shadow 0.3s, color 0.15s;

            &:hover {
                cursor: pointer;
                box-shadow: 0 0 12px 2px rgba(227, 94, 19, 0.9);
            }

            &:active {
                background-color: rgba(18, 18, 19, 0.25);
            }
        }
    }
}
</style>
