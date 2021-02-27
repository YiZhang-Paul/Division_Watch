<template>
    <div class="main-menu-container">
        <div v-show="allowAnimation && stage < 2 && !isClosing" class="stage-1">
            <div class="squares">
                <div class="square" v-for="n in 64" :key="n" :style="getSquareStyle(n - 1, false)"></div>
            </div>

            <div class="wave-circle"></div>
            <div class="wave-circle last-wave"></div>
        </div>

        <div v-show="allowAnimation && stage >= 2 && stage < 3 && !isClosing" class="stage-2">
            <div class="menu-blur-layer"></div>

            <div class="squares">
                <div class="square" v-for="n in 64" :key="n" :style="getSquareStyle(n - 1)"></div>
            </div>

            <div class="box-wrapper">
                <div class="corner-box"></div>
                <div class="corner-box"></div>
                <div class="corner-box"></div>
                <div class="corner-box"></div>
                <div class="box"></div>
            </div>
        </div>

        <div v-show="(!allowAnimation || stage >= 3) && !isClosing"
            class="stage-3"
            :class="{ 'no-op': !allowAnimation }">

            <div class="menu-blur-layer"></div>

            <div class="menu-area">
                <view-selector class="view-selector"
                    :allowAnimation="allowAnimation"
                    @view:selected="onViewSelected($event)">
                </view-selector>

                <menu-button class="close-button" @click="onClose()">Close</menu-button>
            </div>
        </div>

        <div v-show="isClosing" class="closing-stage">
            <div class="menu-blur-layer"></div>

            <div class="box-wrapper">
                <div class="corner-box"></div>
                <div class="corner-box"></div>
                <div class="corner-box"></div>
                <div class="corner-box"></div>
                <div class="box"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import VanillaTilt from 'vanilla-tilt';

import store from '../../store';
import { soundKey } from '../../store/sound/sound.state';
import { categoryKey } from '../../store/category/category.state';
import { taskItemKey } from '../../store/task-item/task-item.state';
import { mainViewKey } from '../../store/main-view/main-view.state';
import { SoundOption } from '../../core/data-model/generic/sound-option';
import MenuButton from '../../shared/controls/MenuButton.vue';
import { ViewOption } from '../../core/enums/view-option.enum';
import { SoundType } from '../../core/enums/sound-type.enum';

import ViewSelector from './ViewSelector.vue';

class MainMenuProp {
    public allowAnimation = prop<boolean>({ default: true });
}

@Options({
    components: {
        ViewSelector,
        MenuButton
    }
})
export default class MainMenu extends Vue.with(MainMenuProp) {
    public stage = 1;
    public isClosing = false;
    private closingStage = 0;

    public created(): void {
        store.dispatch(`${categoryKey}/loadCategories`, true);
        store.dispatch(`${taskItemKey}/loadTaskItemOptions`);
        store.dispatch(`${taskItemKey}/loadIncompleteItems`, true);
    }

    public mounted(): void {
        if (this.allowAnimation) {
            const sound = new SoundOption('menu_open', SoundType.UI);
            setTimeout(() => store.dispatch(`${soundKey}/playSound`, sound), 500);
        }

        VanillaTilt.init(document.querySelector('.menu-area') as HTMLElement, { max: 0.3 });
        document.querySelector('.last-wave')?.addEventListener('animationend', () => this.stage++);
        // 8 animations for stage 2
        document.querySelector('.stage-2')?.addEventListener('animationend', () => this.stage += 1 / 8);
        // 4 animations for closing stage
        document.querySelector('.closing-stage')?.addEventListener('animationend', () => {
            if (++this.closingStage === 4) {
                store.commit(`${mainViewKey}/setActiveView`, ViewOption.Inactive);
            }
        });
    }

    public getSquareStyle(index: number, showAll = true): { [key: string]: string } {
        const rowIndex = Math.floor(index / 8);
        const columnIndex = index % 8;

        return {
            top: `calc((100% - var(--square-dimension)) / 7 * ${rowIndex})`,
            left: `calc((100% - var(--square-dimension)) / 7 * ${columnIndex})`,
            visibility: showAll || this.isVisibleSquare(rowIndex, columnIndex) ? 'visible' : 'hidden'
        };
    }

    public onViewSelected(view: ViewOption): void {
        store.commit(`${mainViewKey}/setActiveView`, view);
    }

    public onClose(): void {
        this.isClosing = true;
        this.closingStage = 0;
    }

    private isVisibleSquare(rowIndex: number, columnIndex: number): boolean {
        if (rowIndex === 0 || rowIndex === 7) {
            return columnIndex > 1 && columnIndex < 6;
        }

        if (rowIndex === 1 || rowIndex === 6) {
            return columnIndex > 0 && columnIndex < 7;
        }

        return true;
    }
}
</script>

<style lang="scss" scoped>
.main-menu-container {
    $box-expand-time: 0.125s;
    --square-dimension: 0.25vh;

    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;

    .square {
        width: var(--square-dimension);
        height: var(--square-dimension);
        min-width: var(--square-dimension);
        min-height: var(--square-dimension);
        background-color: rgba(205, 205, 205, 0.55);
    }

    .menu-blur-layer {
        width: 100%;
        height: 100%;
        background-color: rgba(227, 227, 227, 0.05);
        backdrop-filter: blur(5px);
    }

    .box-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;

        .corner-box {
            position: absolute;
            width: 1vw;
            height: 0.5vh;
            background-color: rgba(205, 205, 205, 0.4);

            &:nth-child(1) {
                left: 0;
                top: 0;
            }

            &:nth-child(2) {
                left: 0;
                bottom: 0;
            }

            &:nth-child(3) {
                right: 0;
                top: 0;
            }

            &:nth-child(4) {
                right: 0;
                bottom: 0;
            }
        }

        .box {
            position: absolute;
            min-height: 0.4vh;
            border: 1px solid rgba(205, 205, 205, 0.3);
        }
    }

    .stage-1, .stage-2, .stage-3, .closing-stage {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .stage-1 {
        $reveal-time: 0.05s;
        $square-expand-time: 0.15s;

        width: 20vh;
        height: 20vh;
        opacity: 0;
        animation: revealContent $reveal-time ease-in forwards;

        .squares {
            $dimension: calc(var(--square-dimension) * 15);

            position: relative;
            width: var(--square-dimension);
            height: var(--square-dimension);
            animation: expandStage1Squares $square-expand-time ease-out calc(#{$reveal-time} / 3 * 2) forwards;

            .square {
                position: absolute;
            }

            @keyframes expandStage1Squares {
                from {
                    width: var(--square-dimension);
                    height: var(--square-dimension);
                }
                to {
                    width: $dimension;
                    height: $dimension;
                }
            }
        }

        .wave-circle {
            $base-delay: calc((#{$square-expand-time} + #{$reveal-time}) / 2);

            position: absolute;
            border: 1px solid rgba(205, 205, 205, 0.6);
            border-radius: 50%;
            opacity: 0;
            animation: emitWave 0.25s ease-in-out $base-delay forwards;

            &.last-wave {
                animation-delay: calc(#{$base-delay} + 0.125s);
            }

            @keyframes emitWave {
                0% {
                    width: 15%;
                    height: 15%;
                    opacity: 0.7;
                }
                20% {
                    opacity: 1;
                }
                100% {
                    width: 60%;
                    height: 60%;
                    opacity: 0;
                }
            }
        }
    }

    .stage-2 {
        width: 100%;
        height: 100%;

        .menu-blur-layer {
            width: 0;
            height: 0;
            animation: expandPanel $box-expand-time ease-in forwards;
        }

        .squares {
            $initial-dimension: calc(var(--square-dimension) * 15);

            position: absolute;
            width: $initial-dimension;
            height: $initial-dimension;
            animation: expandStage2Squares $box-expand-time ease-in forwards,
                       revealContent 0.2s ease-out 1s reverse forwards;

            .square {
                position: absolute;
            }

            @keyframes expandStage2Squares {
                from {
                    width: $initial-dimension;
                    height: $initial-dimension;
                }
                to {
                    width: 90%;
                    height: 85%;
                }
            }
        }

        .box-wrapper {
            width: 1vw;
            height: 0.5vh;
            opacity: 0;
            animation: revealContent 0.1s ease $box-expand-time forwards,
                       blinkNormal 0.4s ease calc(#{$box-expand-time} + 0.05s) forwards,
                       expandBoxWrapper 0.3s linear calc(#{$box-expand-time} + 0.15s) forwards,
                       revealContent 0.2s ease-out 0.5s reverse forwards;

            .box {
                width: 70%;
                height: 20%;
                opacity: 0;
                animation: revealContent 0.1s ease calc(#{$box-expand-time} + 0.1s) forwards,
                           expandBox 0.2s linear calc(#{$box-expand-time} + 0.3s) forwards;
            }
        }
    }

    .stage-3 {
        width: 100%;
        height: 100%;

        .menu-area {
            $close-button-height: 3.5vh;

            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: absolute;
            width: 60%;
            height: 77.5%;

            .view-selector {
                height: calc(98% - #{$close-button-height});
            }

            .close-button {
                width: 4.75vw;
                height: $close-button-height;
                color: rgb(240, 123, 14);
                animation: blinkFast 0.15s ease-in forwards 2;
            }
        }

        &.no-op {
            opacity: 0;
            animation: revealContent 0.4s ease 0.2s forwards;

            .close-button {
                animation: none;
            }
        }
    }

    .closing-stage {
        width: 100%;
        height: 100%;

        .box-wrapper {
            width: 67.5%;
            height: 72.5%;
            animation: expandBoxWrapper 0.2s linear calc(#{$box-expand-time} / 2) forwards reverse,
                       revealContent 0.3s ease calc(#{$box-expand-time} / 2 + 0.2s) forwards reverse;

            .box {
                width: 90%;
                height: 90%;
                background-color: rgba(205, 205, 205, 0.1);
                animation: expandBox 0.1s linear calc(#{$box-expand-time} / 2 + 0.05s) forwards reverse,
                           revealContent 0.3s ease calc(#{$box-expand-time} / 2 + 0.1s) forwards reverse;
            }
        }
    }

    @keyframes expandBoxWrapper {
        0% {
            width: 1vw;
            height: 0.5vh;
        }
        45% {
            width: 60%;
            height: 2vh;
        }
        70% {
            width: 60%;
            height: 2vh;
        }
        100% {
            width: 67.5%;
            height: 72.5%;
        }
    }

    @keyframes expandBox {
        from {
            width: 70%;
            height: 20%;
            background-color: transparent;
        }
        to {
            width: 90%;
            height: 90%;
            background-color: rgba(205, 205, 205, 0.1);
        }
    }
}
</style>
