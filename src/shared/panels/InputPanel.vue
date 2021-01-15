<template>
    <div class="input-panel-container" :style="{ '--input-base-delay': delay + 's' }">
        <div class="content" :class="{ 'no-animation': !hasAnimation }">
            <slot></slot>
        </div>

        <div class="square-top-left" :class="{ 'no-animation': !hasAnimation }"></div>
        <div class="square-top-right" :class="{ 'no-animation': !hasAnimation }"></div>
        <div class="square-bottom-left" :class="{ 'no-animation': !hasAnimation }"></div>
        <div class="square-bottom-right" :class="{ 'no-animation': !hasAnimation }"></div>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

class InputPanelProp {
    public hasAnimation = prop<boolean>({ default: true });
    public delay = prop<number>({ default: 1 });
}

export default class InputPanel extends Vue.with(InputPanelProp) { }
</script>

<style lang="scss" scoped>
.input-panel-container {
    $square-dimension: 0.1rem;

    position: relative;

    .content {
        width: 100%;
        height: 100%;
        opacity: 0;
        animation: revealContent 0.3s ease calc(var(--input-base-delay) + 0.45s) forwards;
    }

    .square-top-left,
    .square-top-right,
    .square-bottom-left,
    .square-bottom-right {
        position: absolute;
        top: 0;
        left: calc(50% - #{$square-dimension} / 2);
        width: $square-dimension;
        height: $square-dimension;
        background-color: rgb(196, 196, 196);
        opacity: 0;
    }

    .square-top-left {
        animation: revealContent 0.15s ease var(--input-base-delay) forwards,
                   moveSquareLeft 0.25s ease calc(var(--input-base-delay) + 0.15s) forwards;
    }

    .square-top-right {
        animation: revealContent 0.15s ease var(--input-base-delay) forwards,
                   moveSquareRight 0.25s ease calc(var(--input-base-delay) + 0.15s) forwards;
    }

    .square-bottom-left {
        animation: revealContent 0.15s ease var(--input-base-delay) forwards,
                   moveSquareLeft 0.25s ease calc(var(--input-base-delay) + 0.15s) forwards,
                   moveSquareDown 0.25s ease calc(var(--input-base-delay) + 0.4s) forwards;
    }

    .square-bottom-right {
        animation: revealContent 0.15s ease var(--input-base-delay) forwards,
                   moveSquareRight 0.25s ease calc(var(--input-base-delay) + 0.15s) forwards,
                   moveSquareDown 0.25s ease calc(var(--input-base-delay) + 0.4s) forwards;
    }

    .no-animation {
        opacity: 1;
        animation: none;
    }

    .square-top-left.no-animation {
        top: 0;
        left: 0;
    }

    .square-top-right.no-animation {
        top: 0;
        left: calc(100% - #{$square-dimension});
    }

    .square-bottom-left.no-animation {
        top: calc(100% - #{$square-dimension});
        left: 0;
    }

    .square-bottom-right.no-animation {
        top: calc(100% - #{$square-dimension});
        left: calc(100% - #{$square-dimension});
    }

    @keyframes moveSquareLeft {
        from {
            left: calc(50% - #{$square-dimension} / 2);
        }
        to {
            left: 0;
        }
    }

    @keyframes moveSquareRight {
        from {
            left: calc(50% - #{$square-dimension} / 2);
        }
        to {
            left: calc(100% - #{$square-dimension});
        }
    }

    @keyframes moveSquareDown {
        from {
            top: 0;
        }
        to {
            top: calc(100% - #{$square-dimension});
        }
    }
}
</style>
