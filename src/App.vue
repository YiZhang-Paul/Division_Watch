<template>
    <agent-watch id="watch-face-area" class="watch-face"></agent-watch>
    <task-manager class="task-manager"></task-manager>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import AgentWatch from './features/agent-watch/AgentWatch.vue';
import TaskManager from './features/task-manager/TaskManager.vue';

@Options({
    components: {
        AgentWatch,
        TaskManager
    }
})
export default class App extends Vue {

    public mounted(): void {
        this.updateFontSize();
        window.addEventListener('resize', this.updateFontSize);
    }

    public beforeUnmount(): void {
        window.removeEventListener('resize', this.updateFontSize);
    }

    private updateFontSize(): void {
        const element = document.querySelector('html');

        if (element) {
            element.style.fontSize = `${element.offsetHeight / 29.375}px`;
        }
    }
}
</script>

<style lang="scss">
@font-face {
    font-family: 'Bruno Ace';
    src: url('assets/fonts/Bruno Ace Regular.ttf');
}

@font-face {
    font-family: 'Digital Numbers';
    src: url('assets/fonts/DigitalNumbers-Regular.ttf');
}

@font-face {
    font-family: 'Segoe UI';
    src: url('assets/fonts/segoeui.ttf');
}

html, body, #app {
    width: 100%;
    height: 100%;
    background-color: transparent;
    font-family: 'Segoe UI';
    user-select: none;
}

html, body {
    margin: 0;
    padding: 0;
}

#app {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background-color: rgb(0, 0, 0);
}

.os-theme-dark {

    & > .os-scrollbar-vertical {
        width: 11px;
    }

    & > .os-scrollbar > .os-scrollbar-track > .os-scrollbar-handle {
        border-radius: 0;
        background-image: url("data:image/svg+xml;utf8,<svg fill='none' height='2' viewBox='0 0 2 2' width='2' xmlns='http://www.w3.org/2000/svg'><path d='M0 0h2v2H0z' fill='rgba(255, 255, 255, 0.6)'/></svg>"),
                          url("data:image/svg+xml;utf8,<svg fill='none' height='2' viewBox='0 0 2 2' width='2' xmlns='http://www.w3.org/2000/svg'><path d='M0 0h2v2H0z' fill='rgba(255, 255, 255, 0.6)'/></svg>"),
                          url("data:image/svg+xml;utf8,<svg fill='none' height='2' viewBox='0 0 2 2' width='2' xmlns='http://www.w3.org/2000/svg'><path d='M0 0h2v2H0z' fill='rgba(255, 255, 255, 0.6)'/></svg>"),
                          url("data:image/svg+xml;utf8,<svg fill='none' height='2' viewBox='0 0 2 2' width='2' xmlns='http://www.w3.org/2000/svg'><path d='M0 0h2v2H0z' fill='rgba(255, 255, 255, 0.6)'/></svg>");
        background-repeat: no-repeat;
        background-size: 2px 2px;
        background-position: left top, left bottom, right bottom, right top;
    }
}

.watch-face {
    $dimension: 30vh;

    position: absolute;
    top: calc(#{$dimension} / 20);
    right: calc(#{$dimension} / 20);
    width: $dimension;
    height: $dimension;
}

.task-manager {
    width: 50%;
    height: 90%;
}

@keyframes revealContent {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes blinkFast {
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

@keyframes blinkNormal {
    0% {
        opacity: 0;
    }
    10% {
        opacity: 0.1;
    }
    11% {
        opacity: 1;
    }
    30% {
        opacity: 1;
    }
    31% {
        opacity: 0.1;
    }
    50% {
        opacity: 0.1;
    }
    51% {
        opacity: 1;
    }
    70% {
        opacity: 1;
    }
    71% {
        opacity: 0.1;
    }
    72% {
        opacity: 1;
    }
    100% {
        opacity: 1;
    }
}

@keyframes blinkSlow {
    0% {
        opacity: 0;
    }
    25% {
        opacity: 0.2;
    }
    50% {
        opacity: 1;
    }
    51% {
        opacity: 0.5;
    }
    53% {
        opacity: 0.5;
    }
    54% {
        opacity: 1;
    }
    56% {
        opacity: 1;
    }
    57% {
        opacity: 0.5;
    }
    59% {
        opacity: 0.5;
    }
    60% {
        opacity: 1;
    }
    62% {
        opacity: 1;
    }
    63% {
        opacity: 0.5;
    }
    70% {
        opacity: 1;
    }
    100% {
        opacity: 1;
    }
}
</style>
