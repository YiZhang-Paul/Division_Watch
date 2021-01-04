<template>
    <div class="input-panel-container">
        <div class="content">
            <slot></slot>
        </div>

        <div class="square-top-left"></div>
        <div class="square-top-right"></div>
        <div class="square-bottom-left"></div>
        <div class="square-bottom-right"></div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class InputPanel extends Vue { }
</script>

<style lang="scss" scoped>
.input-panel-container {
    $square-dimension: 0.3em;

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
            left: calc(50% - 0.15em);
        }
        to {
            left: 0;
        }
    }

    @keyframes moveSquareRight {
        from {
            left: calc(50% - 0.15em);
        }
        to {
            left: calc(100% - 0.3em);
        }
    }

    @keyframes moveSquareDown {
        from {
            top: 0;
        }
        to {
            top: calc(100% - 0.3em);
        }
    }
}
</style>
