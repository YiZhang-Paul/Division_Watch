<template>
    <div class="access-menu-container glass-panel-dark" :style="colorOption">
        <div v-for="option of options"
            class="option-button"
            :style="{ transform: 'rotate(' + (isOptionsVisible ? option.angle : 0) + 'deg)' }"
            :key="option.name">

            <button class="glass-panel-dark"
                :style="{ transform: 'rotate(' + -option.angle + 'deg)', color: isOptionsDisabled ? 'grey' : option.color }"
                @mouseover="activeOption = option.name"
                @mouseout="activeOption = ''"
                @click="$emit('menu:select', option.name)">

                <component :is="option.icon"></component>
            </button>
        </div>

        <div class="option-name glass-panel-dark">
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
import { markRaw } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { Apps, Biohazard, CloseCircle, Cog, PowerStandby, Play } from 'mdue';

import store from '../../store';
import { WatchMenuOption } from '../../core/enums/watch-menu-option.enum';

@Options({
    components: {
        Apps,
        Biohazard,
        CloseCircle,
        Cog,
        PowerStandby,
        Play
    },
    emits: [
        'menu:select',
        'menu:close'
    ]
})
export default class AccessMenu extends Vue {
    public options = [
        markRaw({ name: WatchMenuOption.ShutDown, icon: PowerStandby, angle: 46, color: 'rgb(255, 9, 9)' }),
        markRaw({ name: WatchMenuOption.Setting, icon: Cog, angle: 136, color: 'rgb(255, 255, 255)' }),
        markRaw({ name: WatchMenuOption.MainMenu, icon: Apps, angle: 236, color: 'rgb(51, 233, 121)' }),
        markRaw({ name: WatchMenuOption.Ongoing, icon: Play, angle: 271, color: 'rgb(239, 255, 9)' }),
        markRaw({ name: WatchMenuOption.Interruption, icon: Biohazard, angle: 306, color: 'rgb(33, 188, 254)' })
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
.access-menu-container {
    $option-name-dimension: 60%;

    width: 100%;
    height: 100%;
    color: rgb(255, 255, 255);
    font-family: 'Jost';

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
        font-size: 0.6rem;
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
        font-size: 2rem;
        transition: color 0.15s, font-size 0.15s;

        &:hover {
            cursor: pointer;
            color: rgb(240, 44, 44);
            font-size: 2.5rem;
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
        font-size: 0.75rem;
        transition: border 0.3s, box-shadow 0.3s, color 0.15s;

        &:hover {
            cursor: pointer;
            box-shadow: 0 0 12px 2px var(--border-shadow);
        }

        &:active {
            background-color: rgba(18, 18, 19, 0.25);
        }
    }
}
</style>
