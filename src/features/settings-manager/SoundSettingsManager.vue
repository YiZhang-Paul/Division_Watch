<template>
    <div class="sound-settings-manager-container">
        <section-panel class="section-panel" :name="'Sound Configuration'">
            <option-dropdown class="option-dropdown"
                :name="'Tick Sound'"
                :selected="selectedClockSound"
                :options="clockSounds"
                :transform="_ => _.name"
                @options:select="onSettingsChange('clockSound', $event.file)">
            </option-dropdown>
        </section-panel>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../store';
import { settingsKey } from '../../store/settings/settings.state';
// eslint-disable-next-line no-unused-vars
import { SoundSettings } from '../../core/data-model/settings/sound-settings';
import SectionPanel from '../../shared/panels/SectionPanel.vue';
import OptionDropdown from '../../shared/controls/OptionDropdown.vue';
import ValueSlider from '../../shared/controls/ValueSlider.vue';

@Options({
    components: {
        SectionPanel,
        OptionDropdown,
        ValueSlider
    }
})
export default class SoundSettingsManager extends Vue {
    public readonly clockSounds = [
        { name: 'Vintage', file: 'clock_tick_slow' },
        { name: 'Kitchen', file: 'clock_tick_normal' },
        { name: 'Mechanical', file: 'clock_tick_fast' }
    ];

    private updateDebounceTimer: NodeJS.Timeout | null = null;

    get settings(): SoundSettings {
        return store.getters[`${settingsKey}/soundSettings`];
    }

    get selectedClockSound(): { name: string; file: string } | null {
        return this.clockSounds.find(_ => _.file === this.settings.clockSound) ?? null;
    }

    public created(): void {
        store.dispatch(`${settingsKey}/loadSoundSettings`);
        store.dispatch(`${settingsKey}/loadSoundSettingsOptions`);
    }

    public beforeUnmount(): void {
        if (this.updateDebounceTimer) {
            store.dispatch(`${settingsKey}/updateSoundSettings`, this.settings);
        }
    }

    public onSettingsChange<T>(key: string, value: T): void {
        const settings = { ...this.settings, [key]: value } as SoundSettings;
        store.commit(`${settingsKey}/setSoundSettings`, settings);

        if (this.updateDebounceTimer) {
            clearTimeout(this.updateDebounceTimer);
        }

        this.updateDebounceTimer = setTimeout(() => {
            store.dispatch(`${settingsKey}/updateSoundSettings`, this.settings);
            this.updateDebounceTimer = null;
        }, 400);
    }
}
</script>

<style lang="scss" scoped>
.sound-settings-manager-container {
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
