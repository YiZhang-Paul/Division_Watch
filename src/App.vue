<template>
    <agent-watch class="agent-watch"></agent-watch>
    <main-menu v-if="activeView === viewOption.MainMenu"></main-menu>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from './store';
import { mainViewKey } from './store/main-view/main-view.state';
import { ViewOption } from './core/enums/view-option.enum';
import AgentWatch from './features/agent-watch/AgentWatch.vue';
import MainMenu from './features/main-menu/MainMenu.vue';

@Options({
    components: {
        AgentWatch,
        MainMenu
    }
})
export default class App extends Vue {
    public viewOption = ViewOption;

    get activeView(): ViewOption {
        return store.getters[`${mainViewKey}/activeView`];
    }

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
@import './styles/preset.scss';
@import './styles/animations.scss';

@font-face {
    font-family: 'Digital Numbers';
    src: url('assets/fonts/DigitalNumbers-Regular.ttf');
}

@font-face {
    font-family: 'Jost';
    src: url('assets/fonts/Jost-Regular.ttf');
}

html, body, #app {
    width: 100%;
    height: 100%;
    background-color: transparent;
    font-family: 'Jost';
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

.agent-watch {
    $dimension: 30vh;

    position: absolute;
    top: calc(#{$dimension} / 20);
    right: calc(#{$dimension} / 20);
    width: $dimension;
    height: $dimension;

    &:nth-child(2) {
        top: calc(#{$dimension} / 20 + #{$dimension});
    }
}
</style>
