<template>
    <div class="input-panel-container">
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
}

export default class InputPanel extends Vue.with(InputPanelProp) { }
</script>

<style lang="scss" scoped>
.input-panel-container {
    $square-dimension: 0.2rem;

    position: relative;

    .content {
        width: 100%;
        height: 100%;
        opacity: 0;
        animation: revealContent 0.3s ease 1.4s forwards;
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
        animation: blinkSquare 0.4s linear 0.7s forwards,
                   moveSquareLeft 0.25s ease 1.1s forwards;
    }

    .square-top-right {
        animation: blinkSquare 0.4s linear 0.7s forwards,
                   moveSquareRight 0.25s ease 1.1s forwards;
    }

    .square-bottom-left {
        animation: blinkSquare 0.4s linear 0.7s forwards,
                   moveSquareLeft 0.25s ease 1.1s forwards,
                   moveSquareDown 0.25s ease 1.35s forwards;
    }

    .square-bottom-right {
        animation: blinkSquare 0.4s linear 0.7s forwards,
                   moveSquareRight 0.25s ease 1.1s forwards,
                   moveSquareDown 0.25s ease 1.35s forwards;
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

    @keyframes revealContent {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes blinkSquare {
        0% {
            opacity: 0;
        }
        33% {
            opacity: 0.5;
        }
        66% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    @keyframes moveSquareLeft {
        from {
            left: calc(50% - 0.1rem);
        }
        to {
            left: 0;
        }
    }

    @keyframes moveSquareRight {
        from {
            left: calc(50% - 0.1rem);
        }
        to {
            left: calc(100% - 0.2rem);
        }
    }

    @keyframes moveSquareDown {
        from {
            top: 0;
        }
        to {
            top: calc(100% - 0.2rem);
        }
    }
}
</style>
