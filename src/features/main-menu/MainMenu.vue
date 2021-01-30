<template>
    <div class="main-menu-container">
        <div v-show="stage === 1" class="stage-1">
            <div class="squares">
                <div class="square" v-for="n in 64" :key="n" :style="getSquareStyle(n - 1, false)"></div>
            </div>

            <div class="wave-circle" v-for="n in 3" :key="n" :class="{ 'last-wave': n === 3 }"></div>
        </div>

        <div v-show="stage >= 2 && stage < 3" class="stage-2">
            <div class="blur-layer"></div>

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

        <div v-show="stage === 3" class="stage-3">
            <div class="blur-layer"></div>
            <div class="menu-cards"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class MainMenu extends Vue {
    public stage = 1;

    public mounted(): void {
        const lastWave = document.querySelector('.last-wave');
        const stage2Wrapper = document.querySelector('.stage-2');
        lastWave?.addEventListener('animationend', () => this.stage++);
        // 8 animations in total
        stage2Wrapper?.addEventListener('animationend', () => this.stage += 1 / 8);
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

    .blur-layer {
        width: 100%;
        height: 100%;
        background-color: rgba(227, 227, 227, 0.05);
        filter: blur(5px);
    }

    .stage-1, .stage-2, .stage-3 {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .stage-1 {
        $reveal-time: 0.1s;
        $square-expand-time: 0.2s;

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
            $base-delay: calc((#{$square-expand-time} + #{$reveal-time}) / 3 * 2);

            position: absolute;
            border: 1px solid rgba(205, 205, 205, 0.6);
            border-radius: 50%;
            opacity: 0;
            animation: emitWave 0.5s ease-in-out $base-delay forwards;

            &:nth-child(2) {
                animation-delay: calc(#{$base-delay} + 0.2s);
            }

            &:nth-child(3) {
                animation-delay: calc(#{$base-delay} + 0.3s);
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
        $expand-time: 0.3s;

        width: 100%;
        height: 100%;
        animation: revealContent 0.2s ease-out 1.4s reverse forwards;

        .blur-layer {
            width: 0;
            height: 0;
            animation: expandPanel $expand-time ease-in forwards;
        }

        .squares {
            $initial-dimension: calc(var(--square-dimension) * 15);

            position: absolute;
            width: $initial-dimension;
            height: $initial-dimension;
            animation: expandStage2Squares $expand-time ease-in forwards;

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
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            width: 1vw;
            height: 0.5vh;
            opacity: 0;
            animation: revealContent 0.1s ease $expand-time forwards,
                       blinkNormal 0.9s ease calc(#{$expand-time} + 0.09s) forwards,
                       expandBoxWrapper 0.6s linear calc(#{$expand-time} + 0.3s) forwards;

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
                width: 70%;
                height: 20%;
                min-height: 0.4vh;
                border: 1px solid rgba(205, 205, 205, 0.3);
                opacity: 0;
                animation: revealContent 0.1s ease calc(#{$expand-time} + 0.5s) forwards,
                           expandBox 0.3s linear calc(#{$expand-time} + 0.7s) forwards;
            }

            @keyframes expandBoxWrapper {
                0% {
                    width: 1vw;
                    height: 0.5vh;
                }
                40% {
                    width: 70%;
                    height: 2vh;
                }
                70% {
                    width: 70%;
                    height: 2vh;
                }
                100% {
                    width: 95%;
                    height: 95%;
                }
            }

            @keyframes expandBox {
                from {
                    width: 70%;
                    height: 20%;
                }
                to {
                    width: 95%;
                    height: 95%;
                }
            }
        }
    }

    .stage-3 {
        width: 100%;
        height: 100%;

        .menu-cards {
            position: absolute;
            width: 60%;
            height: 75%;
        }
    }
}
</style>
