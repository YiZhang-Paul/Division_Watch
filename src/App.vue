<template>
    <agent-watch class="watch-face"></agent-watch>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import AgentWatch from './features/agent-watch/AgentWatch.vue';

@Options({
    components: {
        AgentWatch
    }
})
export default class App extends Vue { }
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

html, body, #app {
    width: 100%;
    height: 100%;
    background-color: transparent;
    user-select: none;
}

html, body {
    margin: 0;
    padding: 0;
}

#app {
    position: relative;
    background-color: rgb(23, 36, 151);
}

.watch-face {
    $dimension: 25vh;

    position: absolute;
    top: calc(#{$dimension} / 20);
    right: calc(#{$dimension} / 20);
    width: $dimension;
    height: $dimension;
}
</style>
