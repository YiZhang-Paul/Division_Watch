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
    justify-content: start;
    align-items: center;
    color: rgb(255, 255, 255);
    font-size: 0.9rem;

    .grids {
        display: flex;
        flex-wrap: wrap;
        margin-right: 1vh;
        width: 5vh;
        height: 5vh;
        max-width: 40px;
        max-height: 40px;

        .grid {
            $gap: 5%;
            $dimension: calc((100% - #{$gap} * 2) / 3);

            width: $dimension;
            height: $dimension;
            background-color: rgb(200, 200, 200);

            &:nth-child(2),
            &:nth-child(5),
            &:nth-child(8) {
                margin-left: $gap;
                margin-right: $gap;
            }

            &:nth-child(4),
            &:nth-child(5),
            &:nth-child(6) {
                margin-top: $gap;
                margin-bottom: $gap;
            }

            &.active-grid {
                background-color: rgb(240, 123, 14);
                animation: rotateColor 1.75s linear 0.2s infinite;
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
