<template>
    <agent-watch :id="watchFaceId" class="watch-face" :style="containerStyle"></agent-watch>
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
    private readonly watchFaceId = 'watch-face-area';
    private fontSize = 24;

    get containerStyle(): { [key: string]: string } {
        return { 'font-size': `${this.fontSize}px` };
    }

    public mounted(): void {
        this.updateFontSize();
        window.addEventListener('resize', this.updateFontSize);
    }

    public beforeUnmount(): void {
        window.removeEventListener('resize', this.updateFontSize);
    }

    private updateFontSize(): void {
        const element = document.getElementById(this.watchFaceId);
        this.fontSize = element ? element.offsetHeight / 29.375 : this.fontSize;
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
    height: 80%;
}
</style>
