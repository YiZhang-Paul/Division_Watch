<template>
    <div class="main-menu-container">
        <div v-if="stage === 1" class="stage-1">
            <div class="squares">
                <div class="square" v-for="n in 64" :key="n" :style="getSquareStyle(n - 1)"></div>
            </div>

            <div class="wave-circle" v-for="n in 3" :key="n"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class MainMenu extends Vue {
    public stage = 1;

    public getSquareStyle(index: number): { [key: string]: string } {
        const rowIndex = Math.floor(index / 8);
        const columnIndex = index % 8;

        return {
            top: `calc(100% / 15 * 2 * ${rowIndex})`,
            left: `calc(100% / 15 * 2 * ${columnIndex})`,
            visibility: this.isVisibleSquare(rowIndex, columnIndex) ? 'visible' : 'hidden'
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
    $square-dimension: 0.25vh;

    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;

    .square {
        width: $square-dimension;
        height: $square-dimension;
        background-color: rgba(205, 205, 205, 0.55);
    }

    .stage-1 {
        $reveal-time: 0.3s;
        $square-expand-time: 0.2s;

        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        width: 20vh;
        height: 20vh;
        opacity: 0;
        animation: revealContent $reveal-time ease-in forwards;

        .squares {
            $dimension: calc(#{$square-dimension} * 15);

            position: relative;
            width: $square-dimension;
            height: $square-dimension;
            animation: expandSquares $square-expand-time ease-out calc(#{$reveal-time} / 3 * 2) forwards;

            .square {
                position: absolute;
            }

            @keyframes expandSquares {
                from {
                    width: $square-dimension;
                    height: $square-dimension;
                }
                to {
                    width: $dimension;
                    height: $dimension;
                }
            }
        }

        .wave-circle {
            $base-delay: calc(#{$reveal-time} + #{$square-expand-time});

            position: absolute;
            border: 1px solid rgba(205, 205, 205, 0.6);
            border-radius: 50%;
            opacity: 0;
            animation: emitWave 0.65s ease-in-out $base-delay 2;

            &:nth-child(2) {
                animation-delay: calc(#{$base-delay} + 0.25s);
            }

            &:nth-child(3) {
                animation-delay: calc(#{$base-delay} + 0.35s);
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
}
</style>
