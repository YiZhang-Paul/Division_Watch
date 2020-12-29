<template>
    <div class="access-menu-container glass-panel" :style="colorOption">
        <div v-for="option of options"
            class="option-button"
            :style="{ transform: 'rotate(' + (isOptionsVisible ? option.angle : 0) + 'deg)' }"
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
                @click="$emit('menu:close')" />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Cog, CloseCircle, Finance, InboxMultiple, PowerStandby, Play, PaletteSwatch, TimerSand } from 'mdue';

import store from '../../store';

@Options({
    components: {
        Cog,
        CloseCircle,
        Finance,
        InboxMultiple,
        PowerStandby,
        Play,
        PaletteSwatch,
        TimerSand
    },
    emits: [
        'menu:select',
        'menu:close'
    ]
})
export default class AccessMenu extends Vue {
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
    public isOptionsVisible = false;
    public isOptionsDisabled = false;

    get colorOption(): { [key: string]: string } {
        const option = store.getters['watchBase/colorOption'];

        return {
            '--border-color': option.menuBorder,
            '--border-shadow': option.menuBorderShadow
        };
    }

    public mounted(): void {
        setTimeout(() => this.isOptionsVisible = true, 50);
    }
}
</script>

<style lang="scss" scoped>
.glass-panel {
    background: linear-gradient(to bottom, rgba(121, 117, 131, 0.33), rgba(54, 53, 103, 0.33));
    background-color: rgba(18, 18, 19, 0.95);
    box-shadow: 0 0 4px 1px var(--border-shadow);
    border: 2px solid var(--border-color);
    border-radius: 50%;
    opacity: 0.95;
}

.access-menu-container {
    $option-name-dimension: 60%;

    width: 100%;
    height: 100%;
    color: rgb(255, 255, 255);
    font-family: 'Bruno Ace';

    .option-name span, .close-menu {
        opacity: 0;
        animation: revealContent 0.15s ease-in 0.1s forwards;
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
        transform-origin: 100% 50%;
        transition: transform 0.5s;
    }

    .close-menu {
        color: rgb(255, 0, 0);
        font-size: 2.5em;
        transition: color 0.15s, font-size 0.15s;

        &:hover {
            cursor: pointer;
            color: rgb(240, 44, 44);
            font-size: 3em;
        }
    }

    button {
        $gap: 1%;

        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: calc((50% - #{$option-name-dimension} / 2) * -50);
        left: $gap;
        width: calc((50% - #{$option-name-dimension} / 2 - #{$gap}) * 2);
        height: calc((50% - #{$option-name-dimension} / 2 - #{$gap}) * 100);
        outline: none;
        font-size: 2.5em;
        transition: border 0.3s, box-shadow 0.3s, color 0.15s;

        &:hover {
            cursor: pointer;
            box-shadow: 0 0 12px 2px var(--border-shadow);
        }

        &:active {
            background-color: rgba(18, 18, 19, 0.25);
        }
    }

    @keyframes revealContent {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
}
</style>
