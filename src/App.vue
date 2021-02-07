<template>
    <div v-if="showBlurLayer" class="global-blur-layer"></div>
    <main-menu v-if="activeView === viewOption.MainMenuAnimated"></main-menu>
    <main-menu v-if="activeView === viewOption.MainMenuNoop" :allowAnimation="false"></main-menu>
    <activity-manager class="activity-manager" v-if="activeView === viewOption.Activities"></activity-manager>
    <agent-watch class="agent-watch"></agent-watch>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from './store';
import { mainViewKey } from './store/main-view/main-view.state';
import { ViewOption } from './core/enums/view-option.enum';
import AgentWatch from './features/agent-watch/AgentWatch.vue';
import MainMenu from './features/main-menu/MainMenu.vue';
import ActivityManager from './features/activity-manager/ActivityManager.vue';

@Options({
    components: {
        AgentWatch,
        MainMenu,
        ActivityManager
    }
})
export default class App extends Vue {
    public viewOption = ViewOption;

    get activeView(): ViewOption {
        return store.getters[`${mainViewKey}/activeView`];
    }

    get showBlurLayer(): boolean {
        return this.activeView !== ViewOption.Inactive && this.activeView !== ViewOption.MainMenuAnimated;
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
    background: rgb(0, 0, 0) url('assets/images/background.jpg') center center/cover no-repeat;
}

.global-blur-layer {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-color: rgba(227, 227, 227, 0.05);
    backdrop-filter: blur(5px);
}

.agent-watch {
    $dimension: 30vh;

    position: absolute;
    top: calc(#{$dimension} / 20);
    right: calc(#{$dimension} / 20);
    width: $dimension;
    height: $dimension;
}

.activity-manager {
    position: absolute;
    width: 60%;
    height: 87.5%;
}
</style>
