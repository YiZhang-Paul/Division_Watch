<template>
    <div class="search-panel-container">
        <div class="content">
            <magnify class="icon" />
            <input type="search" placeholder="quick search" @input="$emit('search', $event.target.value)" />
        </div>

        <div class="square-top-left"></div>
        <div class="square-top-right"></div>
        <div class="square-bottom-left"></div>
        <div class="square-bottom-right"></div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Magnify } from 'mdue';

@Options({
    components: { Magnify },
    emits: ['search']
})
export default class SearchPanel extends Vue { }
</script>

<style lang="scss" scoped>
.search-panel-container {
    $square-dimension: 0.3em;

    position: relative;

    .content {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: rgba(63, 62, 68, 0.6);
        color: rgba(238, 238, 238, 0.6);
        opacity: 0;
        animation: revealContent 0.3s ease 1.4s forwards;

        .icon {
            margin-left: 0.25em;
            margin-right: 0.1em;
            font-size: 1.75em;
        }

        input {
            width: 90%;
            border: none;
            background-color: transparent;
            color: rgba(238, 238, 238, 0.6);
            caret-color: rgba(238, 238, 238, 0.6);
            font-size: 1em;
            outline: none;
        }

        input::-webkit-search-cancel-button {
            -webkit-appearance: none;
        }
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

    @keyframes revealContent {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
}
</style>
