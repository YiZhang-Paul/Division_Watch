<template>
    <div class="title-panel-container">
        <div class="grids">
            <div class="grid"
                :class="{ 'active-grid': activeGrid === n - 1 }"
                v-for="n in 9"
                :key="n">
            </div>
        </div>

        <slot></slot>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

class TitlePanelProp {
    public activeGrid = prop<number>({ default: 4 });
}

export default class TitlePanel extends Vue.with(TitlePanelProp) { }
</script>

<style lang="scss" scoped>
.title-panel-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: rgb(255, 255, 255);
    font-size: 0.95rem;

    .grids {
        position: relative;
        margin-right: 1vh;
        width: 5.25vh;
        height: 5.25vh;
        max-width: 40px;
        max-height: 40px;

        .grid {
            $gap: 5%;
            $dimension: calc((100% - #{$gap} * 2) / 3);
            $initial-halt-duration: 0.35s;
            $intermediate-halt-duration: 0.15s;
            $move-duration: 0.25s;

            position: absolute;
            top: calc(#{$dimension} + #{$gap});
            left: calc(#{$dimension} + #{$gap});
            width: $dimension;
            height: $dimension;
            background-color: rgb(200, 200, 200);

            &:nth-child(1) {
                animation: moveGridLeft $move-duration ease $initial-halt-duration forwards,
                           moveGridTop $move-duration ease calc(#{$initial-halt-duration} + (#{$move-duration} + #{$intermediate-halt-duration}) * 3) forwards;
            }

            &:nth-child(2) {
                animation: moveGridRight $move-duration ease $initial-halt-duration forwards,
                           moveGridTop $move-duration ease calc(#{$initial-halt-duration} + #{$move-duration} + #{$intermediate-halt-duration}) forwards,
                           moveGridCenterLeft $move-duration ease calc(#{$initial-halt-duration} + (#{$move-duration} + #{$intermediate-halt-duration}) * 2) forwards;
            }

            &:nth-child(3) {
                animation: moveGridRight $move-duration ease $initial-halt-duration forwards,
                           moveGridTop $move-duration ease calc(#{$initial-halt-duration} + #{$move-duration} + #{$intermediate-halt-duration}) forwards;
            }

            &:nth-child(4) {
                animation: moveGridLeft $move-duration ease $initial-halt-duration forwards;
            }

            &:nth-child(6) {
                animation: moveGridRight $move-duration ease $initial-halt-duration forwards;
            }

            &:nth-child(7) {
                animation: moveGridLeft $move-duration ease $initial-halt-duration forwards,
                           moveGridBottom $move-duration ease calc(#{$initial-halt-duration} + #{$move-duration} + #{$intermediate-halt-duration}) forwards;
            }

            &:nth-child(8) {
                animation: moveGridLeft $move-duration ease $initial-halt-duration forwards,
                           moveGridBottom $move-duration ease calc(#{$initial-halt-duration} + #{$move-duration} + #{$intermediate-halt-duration}) forwards,
                           moveGridCenterRight $move-duration ease calc(#{$initial-halt-duration} + (#{$move-duration} + #{$intermediate-halt-duration}) * 2) forwards;
            }

            &:nth-child(9) {
                animation: moveGridRight $move-duration ease $initial-halt-duration forwards,
                           moveGridBottom $move-duration ease calc(#{$initial-halt-duration} + (#{$move-duration} + #{$intermediate-halt-duration}) * 3) forwards;
            }

            &.active-grid {
                background-color: rgb(240, 123, 14);
                animation: rotateColor 1.25s linear 0.2s infinite;
            }

            @keyframes moveGridTop {
                from { top: calc(#{$dimension} + #{$gap}) }
                to { top: 0 }
            }

            @keyframes moveGridBottom {
                from { top: calc(#{$dimension} + #{$gap}) }
                to { top: calc((#{$dimension} + #{$gap}) * 2) }
            }

            @keyframes moveGridCenterLeft {
                from { left: calc((#{$dimension} + #{$gap}) * 2) }
                to { left: calc(#{$dimension} + #{$gap}) }
            }

            @keyframes moveGridCenterRight {
                from { left: 0 }
                to { left: calc(#{$dimension} + #{$gap}) }
            }

            @keyframes moveGridLeft {
                from { left: calc(#{$dimension} + #{$gap}) }
                to { left: 0 }
            }

            @keyframes moveGridRight {
                from { left: calc(#{$dimension} + #{$gap}) }
                to { left: calc((#{$dimension} + #{$gap}) * 2) }
            }
        }
    }

    @keyframes rotateColor {
        0% {
            background-color: rgb(240, 123, 14);
        }
        50% {
            background-color: rgb(200, 200, 200);
        }
        100% {
            background-color: rgb(240, 123, 14);
        }
    }
}
</style>
