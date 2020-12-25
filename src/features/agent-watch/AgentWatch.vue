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
            <div class="option-name">
                <span>{{ activeOption }}</span>
            </div>

            <div v-for="option of options"
                class="option-button"
                :style="{ transform: 'rotate(' + option.angle + 'deg)', 'transform-origin': '100% 50%' }"
                :key="option.name">

                <button :style="{ transform: 'rotate(' + -option.angle + 'deg)' }"
                    @mouseenter="activeOption = option.name"
                    @mouseleave="activeOption = ''">

                    <power-standby v-if="option.name === 'On/Off'" />
                    <play v-if="option.name === 'Pomodoro'" />
                    <timer-sand v-if="option.name === 'Tasks'" />
                    <palette-swatch v-if="option.name === 'Planner'" />
                    <inbox-multiple v-if="option.name === 'Backlog'" />
                    <chart-timeline-variant-shimmer v-if="option.name === 'Stats'" />
                    <cog v-if="option.name === 'Settings'" />
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Cog, ChartTimelineVariantShimmer, InboxMultiple, PowerStandby, Play, PaletteSwatch, TimerSand } from 'mdue';

import BatteryDisplay from '../../shared/BatteryDisplay.vue';
import WeatherDisplay from '../../shared/WeatherDisplay.vue';
import TimeDisplay from '../../shared/TimeDisplay.vue';
import WatchBase from '../../shared/WatchBase.vue';

@Options({
    components: {
        Cog,
        ChartTimelineVariantShimmer,
        InboxMultiple,
        PowerStandby,
        Play,
        PaletteSwatch,
        TimerSand,
        BatteryDisplay,
        WeatherDisplay,
        TimeDisplay,
        WatchBase
    }
})
export default class AgentWatch extends Vue {
    public options = [
        { name: 'On/Off', angle: 40 },
        { name: 'Pomodoro', angle: 120 },
        { name: 'Tasks', angle: 200 },
        { name: 'Planner', angle: 240 },
        { name: 'Backlog', angle: 280 },
        { name: 'Stats', angle: 320 },
        { name: 'Settings', angle: 360 }
    ];

    public activeOption = '';
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
        $overlay-dimension: 76%;
        $option-name-dimension: 60%;

        position: absolute;
        top: calc(50% - #{$overlay-dimension} / 2);
        left: calc(50% - #{$overlay-dimension} / 2);
        width: calc(#{$overlay-dimension} - 4px);
        height: calc(#{$overlay-dimension} - 4px);
        background: linear-gradient(to bottom, rgba(121, 117, 131, 0.33), rgba(54, 53, 103, 0.33));
        background-color: rgba(18, 18, 19, 0.95);
        border: 2px solid rgba(218, 220, 69, 0.9);
        border-radius: 50%;
        color: rgb(255, 255, 255);
        font-family: 'Bruno Ace';
        opacity: 0.95;

        .option-name {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: calc(50% - #{$option-name-dimension} / 2);
            left: calc(50% - #{$option-name-dimension} / 2);
            width: calc(#{$option-name-dimension} - 4px);
            height: calc(#{$option-name-dimension} - 4px);
            background: linear-gradient(to bottom, rgba(121, 117, 131, 0.33), rgba(54, 53, 103, 0.33));
            background-color: rgba(18, 18, 19, 0.95);
            border: 2px solid rgba(218, 220, 69, 0.9);
            border-radius: 50%;
            box-shadow: 0 0 4px 1px rgba(227, 94, 19, 0.75);
            font-size: 2em;
            opacity: 0.95;
        }

        .option-button {
            position: absolute;
            top: 49.5%;
            left: 0;
            width: 50%;
            height: 1%;
        }

        button {
            position: absolute;
            bottom: calc((#{$overlay-dimension} - #{$option-name-dimension}) * -50);
            left: 4%;
            width: calc((#{$overlay-dimension} - #{$option-name-dimension}) * 2);
            height: calc((#{$overlay-dimension} - #{$option-name-dimension}) * 100);
            background: linear-gradient(to bottom, rgba(121, 117, 131, 0.33), rgba(54, 53, 103, 0.33));
            background-color: rgba(18, 18, 19, 0.95);
            border: 1px solid rgba(218, 220, 69, 0.9);
            border-radius: 50%;
            box-shadow: 0 0 4px 1px rgba(227, 94, 19, 0.75);
            color: rgb(255, 255, 255);
            transition: border 0.3s, box-shadow 0.3s;

            &:hover {
                cursor: pointer;
                border: 2px solid rgba(218, 220, 69, 0.9);
                box-shadow: 0 0 10px 1px rgba(227, 94, 19, 0.75);
            }
        }
    }
}
</style>
