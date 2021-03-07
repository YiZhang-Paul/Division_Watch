<template>
    <div v-if="showBlurLayer" class="global-blur-layer"></div>

    <div class="app-views" :class="{ invisible: activePayload }">
        <main-menu v-if="activeView === viewOption.MainMenuAnimated"></main-menu>
        <main-menu v-if="activeView === viewOption.MainMenuNoop" :allowAnimation="false"></main-menu>
        <activity-manager class="activity-manager" v-if="activeView === viewOption.Activities"></activity-manager>
        <daily-planner class="daily-planner" v-if="activeView === viewOption.Planner"></daily-planner>
        <settings-manager class="settings-manager" v-if="activeView === viewOption.Settings"></settings-manager>
    </div>

    <component v-if="activePayload" :is="activePayload.component" v-bind="activePayload.data"></component>
    <agent-watch v-if="isSoundSettingsLoaded" class="agent-watch"></agent-watch>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from './store';
import { dialogKey } from './store/dialog/dialog.state';
import { mainViewKey } from './store/main-view/main-view.state';
import { settingsKey } from './store/settings/settings.state';
// eslint-disable-next-line no-unused-vars
import { DialogPayload } from './core/data-model/generic/dialog-payload';
import AgentWatch from './features/agent-watch/AgentWatch.vue';
import MainMenu from './features/main-menu/MainMenu.vue';
import ActivityManager from './features/activity-manager/ActivityManager.vue';
import DailyPlanner from './features/daily-planner/DailyPlanner.vue';
import SettingsManager from './features/settings-manager/SettingsManager.vue';
import ConfirmPanel from './shared/panels/ConfirmPanel.vue';
import { ViewOption } from './core/enums/view-option.enum';

@Options({
    components: {
        AgentWatch,
        MainMenu,
        ActivityManager,
        DailyPlanner,
        SettingsManager,
        ConfirmPanel
    }
})
export default class App extends Vue {
    public viewOption = ViewOption;
    public isSoundSettingsLoaded = false;

    get activePayload(): DialogPayload<any> | null {
        return store.getters[`${dialogKey}/activePayload`];
    }

    get activeView(): ViewOption {
        return store.getters[`${mainViewKey}/activeView`];
    }

    get showBlurLayer(): boolean {
        return this.activeView !== ViewOption.Inactive && this.activeView !== ViewOption.MainMenuAnimated;
    }

    public async created(): Promise<void> {
        await store.dispatch(`${settingsKey}/loadSoundSettings`);
        this.isSoundSettingsLoaded = true;
    }

    public mounted(): void {
        this.updateFontSize();
        window.addEventListener('resize', this.updateFontSize);
    }

    public beforeUnmount(): void {
        window.removeEventListener('resize', this.updateFontSize);
    }

    public closeDialog(): void {
        store.dispatch(`${dialogKey}/closeDialog`);
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
    font-family: 'Play';
    src: url('assets/fonts/Play-Regular.ttf');
}

@font-face {
    font-family: 'Jost';
    src: url('assets/fonts/Jost-Regular.ttf');
}

html, body, #app, .app-views {
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

#app, .app-views {
    display: flex;
    justify-content: center;
    align-items: center;
}

#app {
    background: rgb(0, 0, 0) url('assets/images/background.jpg') center center/cover no-repeat;
}

.app-views {
    position: relative;
    transition: opacity 0.2s;

    &.invisible {
        opacity: 0;
    }
}

.global-blur-layer {
    position: absolute;
    top: 0;
    left: 0;
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
    width: 57.5%;
    height: 86.5%;
}

.daily-planner {
    position: relative;
    margin-right: 7.5%;
    width: 75%;
    height: 90%;
}

.settings-manager {
    position: absolute;
    width: 45%;
    height: 75%;
}
</style>
