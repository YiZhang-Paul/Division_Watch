<template>
    <div class="glass-panel-container">
        <div class="background-div">
            <div class="blur-overlay"></div>
        </div>

        <div class="top-bar">
            <div class="square-left"></div>
            <div class="line-top"></div>
            <div class="square-right"></div>
        </div>

        <slot></slot>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class GlassPanel extends Vue { }
</script>

<style lang="scss" scoped>
.glass-panel-container {
    $square-dimension: 0.4em;

    position: relative;
    border: 1px solid rgba(0, 0, 0, 0);
    animation: revealBorder 0.1s ease 1s forwards;

    .background-div {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 0;
        overflow: hidden;
        animation: expandPanel 0.4s ease 0.6s forwards;

        .blur-overlay {
            position: absolute;
            top: -5%;
            left: -5%;
            width: 110%;
            height: 110%;
            background: linear-gradient(to bottom, rgba(121, 117, 131, 0.3), rgba(54, 53, 103, 0.3));
            background-color: rgba(49, 48, 54, 0.5);
            filter: blur(3px);
        }
    }

    .top-bar {
        position: relative;

        .square-left, .line-top, .square-right {
            position: absolute;
            background-color: rgb(196, 196, 196);
        }

        .square-left, .square-right {
            top: calc(-#{$square-dimension} / 2);
            left: calc(50% - #{$square-dimension} / 2);
            width: $square-dimension;
            height: $square-dimension;
            opacity: 0;
        }

        .square-left {
            animation: blinkSquare 0.4s linear forwards,
                       moveSquareLeft 0.25s ease 0.4s forwards;
        }

        .line-top {
            top: 0;
            left: 50%;
            width: 0;
            height: calc(#{$square-dimension} / 3);
            animation: expandLine 0.25s ease 0.45s forwards;
        }

        .square-right {
            animation: blinkSquare 0.4s linear forwards,
                       moveSquareRight 0.25s ease 0.4s forwards;
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
            left: calc(50% - 0.2em);
        }
        to {
            left: -0.2em;
        }
    }

    @keyframes moveSquareRight {
        from {
            left: calc(50% - 0.2em);
        }
        to {
            left: calc(100% - 0.2em);
        }
    }

    @keyframes expandLine {
        from {
            left: 50%;
            width: 0;
        }
        to {
            left: 0.4em;
            width: calc(100% - 0.8em);
        }
    }

    @keyframes expandPanel {
        from {
            height: 0;
        }
        to {
            height: 100%;
        }
    }

    @keyframes revealBorder {
        from {
            border-color: rgba(0, 0, 0, 0);
        }
        to {
            border-color: rgba(255, 255, 255, 0.1);
        }
    }
}
</style>
