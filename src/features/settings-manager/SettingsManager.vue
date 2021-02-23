<template>
    <view-panel>
        <template v-slot:header>
            <div class="header-content">
                <title-panel :activeGrid="8">Settings</title-panel>

                <compact-tab-group class="compact-tab-group"
                    :options="tabs"
                    :showBadge="false"
                    @tab:selected="activeTab = $event">
                </compact-tab-group>
            </div>
        </template>

        <div class="main-content">
            <session-settings-manager v-if="activeTab === 0" class="session-settings-manager"></session-settings-manager>
        </div>

        <template v-slot:footer>
            <div class="footer-content">
                <menu-button class="back-button" @click="backToMain()">Back</menu-button>
                <menu-button class="close-button" @click="closePanel()">Close</menu-button>
            </div>
        </template>
    </view-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { markRaw } from 'vue';
import { TimerSand, VolumeHigh } from 'mdue';

import store from '../../store';
import { mainViewKey } from '../../store/main-view/main-view.state';
import { TabGroupOption } from '../../core/data-model/generic/tab-group-option';
import TitlePanel from '../../shared/panels/TitlePanel.vue';
import ViewPanel from '../../shared/panels/ViewPanel.vue';
import MenuButton from '../../shared/controls/MenuButton.vue';
import CompactTabGroup from '../../shared/controls/CompactTabGroup.vue';
import { ViewOption } from '../../core/enums/view-option.enum';

import SessionSettingsManager from './SessionSettingsManager.vue';

@Options({
    components: {
        TimerSand,
        VolumeHigh,
        TitlePanel,
        ViewPanel,
        MenuButton,
        CompactTabGroup,
        SessionSettingsManager
    }
})
export default class SettingsManager extends Vue {
    public activeTab = 0;

    get tabs(): TabGroupOption[] {
        return [
            markRaw(new TabGroupOption('Session', TimerSand)),
            markRaw(new TabGroupOption('Sound', VolumeHigh))
        ]
    }

    public backToMain(): void {
        store.commit(`${mainViewKey}/setActiveView`, ViewOption.MainMenuNoop);
    }

    public closePanel(): void {
        store.commit(`${mainViewKey}/setActiveView`, ViewOption.Inactive);
    }
}
</script>

<style lang="scss" scoped>
.header-content, .main-content, .session-settings-manager, .footer-content {
    display: flex;
    width: 100%;
    height: 100%;
}

.header-content {
    align-items: flex-end;

    .compact-tab-group {
        margin-left: auto;
    }
}

.main-content {
    $margin: 1.5%;

    margin-left: $margin;
    width: calc(100% - #{$margin} * 2);
}

.footer-content {
    align-items: center;

    .back-button, .close-button {
        width: 4.75vw;
        height: 3.5vh;
    }

    .back-button {
        margin-right: 1.5%;
        color: rgb(255, 255, 255);
    }

    .close-button {
        color: rgb(240, 123, 14);
    }
}
</style>
