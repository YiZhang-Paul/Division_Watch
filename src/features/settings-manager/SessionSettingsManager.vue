<template>
    <div class="session-settings-manager-container">
        <section-panel class="section-panel" :name="'Session Configuration'">
            <option-dropdown class="option-dropdown"
                :name="'Session/Short Break Duration'"
                :selected="[settings.sessionDuration, settings.shortBreakDuration]"
                :options="durationCombos"
                :transform="toDisplayDurationCombo"
                @options:select="onDurationComboChange($event)">
            </option-dropdown>

            <option-dropdown class="option-dropdown"
                :name="'Long Break Duration'">
            </option-dropdown>

            <option-dropdown class="option-dropdown"
                :name="'Daily Limit Suggestion'">
            </option-dropdown>
        </section-panel>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../store';
import { settingsKey } from '../../store/settings/settings.state';
// eslint-disable-next-line no-unused-vars
import { SessionSettings } from '../../core/data-model/settings/session-settings';
// eslint-disable-next-line no-unused-vars
import { SessionSettingsOptions } from '../../core/data-model/settings/session-settings-options';
import SectionPanel from '../../shared/panels/SectionPanel.vue';
import OptionDropdown from '../../shared/controls/OptionDropdown.vue';
import { TimeUtility } from '../../core/utilities/time/time.utility';

@Options({
    components: {
        SectionPanel,
        OptionDropdown
    }
})
export default class SessionSettingsManager extends Vue {

    get durationCombos(): [number, number][] {
        return this.options.durationSeries.map(_ => [_.sessionDuration, _.shortBreakDuration]);
    }

    get options(): SessionSettingsOptions {
        return store.getters[`${settingsKey}/sessionSettingsOptions`];
    }

    get settings(): SessionSettings {
        return store.getters[`${settingsKey}/sessionSettings`];
    }

    public created(): void {
        store.dispatch(`${settingsKey}/loadSessionSettings`);
        store.dispatch(`${settingsKey}/loadSessionSettingsOptions`);
    }

    public onDurationComboChange(combo: [number, number]): void {
        store.dispatch(`${settingsKey}/updateSessionSettings`, {
            ...this.settings,
            sessionDuration: combo[0],
            shortBreakDuration: combo[1]
        } as SessionSettings);
    }

    public toDisplayDurationCombo(combo: [number, number]): string {
        const durations = combo.map(TimeUtility.toMinutes);

        return `${durations[0]} Minutes Session + ${durations[1]} Minutes Break`;
    }
}
</script>

<style lang="scss" scoped>
.session-settings-manager-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 1.5vh;

    .section-panel {
        width: 95%;

        .option-dropdown {
            width: 100%;
        }

        .option-dropdown:not(:nth-last-child(1)) {
            margin-bottom: 2.5%;
        }
    }
}
</style>
