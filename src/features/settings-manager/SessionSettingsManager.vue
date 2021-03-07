<template>
    <div class="session-settings-manager-container">
        <section-panel class="section-panel" :name="'Session Configuration'">
            <option-dropdown class="option-dropdown"
                :name="'Session/Short Break Duration'"
                :selected="selectedDurationCombo"
                :options="durationCombos"
                :transform="toDisplayDurationCombo"
                @options:select="onDurationComboChange($event)">
            </option-dropdown>

            <value-slider class="value-slider"
                :name="'Long Break Duration'"
                :min="longBreakRange.min"
                :max="longBreakRange.max"
                :steps="toMinutes(longBreakRange.max - longBreakRange.min)"
                :selected="settings.longBreakDuration"
                :transform="toMinutesText"
                @change="onSettingsChange('longBreakDuration', $event)">
            </value-slider>

            <value-slider class="value-slider"
                :name="'Daily Limit Suggestion'"
                :min="options.dailyLimits[0]"
                :max="options.dailyLimits[options.dailyLimits.length - 1]"
                :steps="options.dailyLimits.length - 1"
                :selected="settings.dailyLimitSuggestion"
                :transform="toHoursText"
                @change="onSettingsChange('dailyLimitSuggestion', $event)">
            </value-slider>
        </section-panel>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { markRaw } from 'vue';

import store from '../../store';
import { dialogKey } from '../../store/dialog/dialog.state';
import { settingsKey } from '../../store/settings/settings.state';
import { Range } from '../../core/data-model/generic/range';
import { DialogPayload } from '../../core/data-model/generic/dialog-payload';
import { ConfirmDialogOption } from '../../core/data-model/generic/confirm-dialog-option';
// eslint-disable-next-line no-unused-vars
import { SessionSettings } from '../../core/data-model/settings/session-settings';
// eslint-disable-next-line no-unused-vars
import { SessionSettingsOptions } from '../../core/data-model/settings/session-settings-options';
import SectionPanel from '../../shared/panels/SectionPanel.vue';
import OptionDropdown from '../../shared/controls/OptionDropdown.vue';
import ValueSlider from '../../shared/controls/ValueSlider.vue';
import ConfirmDialog from '../../shared/widgets/ConfirmDialog.vue';
import { TimeUtility } from '../../core/utilities/time/time.utility';

@Options({
    components: {
        SectionPanel,
        OptionDropdown,
        ValueSlider
    }
})
export default class SessionSettingsManager extends Vue {
    private updateDebounceTimer: NodeJS.Timeout | null = null;

    get durationCombos(): [number, number][] {
        return this.options.durationSeries.map(_ => [_.sessionDuration, _.shortBreakDuration]);
    }

    get selectedDurationCombo(): [number, number] {
        return [this.settings.sessionDuration, this.settings.shortBreakDuration];
    }

    get longBreakRange(): Range {
        const selected = this.toDisplayDurationCombo(this.selectedDurationCombo);
        const index = this.durationCombos.findIndex(_ => this.toDisplayDurationCombo(_) === selected);

        return index === -1 ? new Range() : this.options.durationSeries[index].longBreakRange;
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

    public beforeUnmount(): void {
        if (this.updateDebounceTimer) {
            store.dispatch(`${settingsKey}/updateSessionSettings`, this.settings);
        }
    }

    public onDurationComboChange(combo: [number, number]): void {
        const confirmHook = () => {
            this.onSettingsChange('sessionDuration', combo[0]);
            this.onSettingsChange('shortBreakDuration', combo[1]);
            this.onSettingsChange('longBreakDuration', this.longBreakRange.min);
        };

        const title = 'Session time will be rounded/truncated if necessary.';
        const option = new ConfirmDialogOption(title, 'Proceed', true);
        const payload = new DialogPayload(markRaw(ConfirmDialog), option, confirmHook);
        store.dispatch(`${dialogKey}/open`, payload);
    }

    public onSettingsChange<T>(key: string, value: T): void {
        const settings = { ...this.settings, [key]: value } as SessionSettings;
        store.commit(`${settingsKey}/setSessionSettings`, settings);

        if (this.updateDebounceTimer) {
            clearTimeout(this.updateDebounceTimer);
        }

        this.updateDebounceTimer = setTimeout(() => {
            store.dispatch(`${settingsKey}/updateSessionSettings`, this.settings);
            this.updateDebounceTimer = null;
        }, 400);
    }

    public toMinutes(milliseconds: number): number {
        return TimeUtility.toMinutes(milliseconds);
    }

    public toMinutesText(milliseconds: number): string {
        const minutes = TimeUtility.toMinutes(milliseconds);

        return `${minutes} min${minutes > 1 ? 's' : ''}`;
    }

    public toHoursText(milliseconds: number): string {
        const hours = TimeUtility.toMinutes(milliseconds) / 60;

        return `${hours} hour${hours > 1 ? 's' : ''}`;
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

        .option-dropdown, .value-slider {
            width: 100%;

            &:not(:nth-last-child(1)) {
                margin-bottom: 2.5%;
            }
        }
    }
}
</style>
