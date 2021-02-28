<template>
    <div class="sound-settings-manager-container">
        <section-panel class="section-panel" :name="'Sound Configuration'">
            <div class="master-slider">
                <div class="mute-toggle">
                    <checkbox class="checkbox"
                        :modelValue="settings.isMuted"
                        @update:modelValue="onMuteToggle($event)">
                    </checkbox>

                    <span>{{ settings.isMuted ? 'Unmute Sound' : 'Mute Sound' }}</span>
                </div>

                <value-slider class="slider"
                    :name="'Master Volume'"
                    :min="options.masterVolume.min"
                    :max="options.masterVolume.max"
                    :steps="options.masterVolume.max - options.masterVolume.min"
                    :selected="settings.masterVolume"
                    :transform="_ => _ + ' %'"
                    @change="onMasterVolumeChange($event)">
                </value-slider>
            </div>

            <value-slider class="value-slider"
                :name="'UI Volume'"
                :min="options.uiVolume.min"
                :max="options.uiVolume.max"
                :steps="options.uiVolume.max - options.uiVolume.min"
                :selected="settings.uiVolume"
                :transform="_ => _ + ' %'"
                @change="onUIVolumeChange($event)">
            </value-slider>

            <value-slider class="value-slider"
                :name="'Clock Volume'"
                :min="options.clockVolume.min"
                :max="options.clockVolume.max"
                :steps="options.clockVolume.max - options.clockVolume.min"
                :selected="settings.clockVolume"
                :transform="_ => _ + ' %'"
                @change="onClockVolumeChange($event)">
            </value-slider>

            <option-dropdown class="option-dropdown"
                :name="'Tick Sound'"
                :selected="selectedClockSound"
                :options="clockSounds"
                :transform="_ => _.name"
                @options:select="onClockSoundChange($event.file)">
            </option-dropdown>
        </section-panel>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../store';
import { soundKey } from '../../store/sound/sound.state';
import { settingsKey } from '../../store/settings/settings.state';
// eslint-disable-next-line no-unused-vars
import { SoundSettings } from '../../core/data-model/settings/sound-settings';
// eslint-disable-next-line no-unused-vars
import { SoundSettingsOptions } from '../../core/data-model/settings/sound-settings-options';
import { SoundOption } from '../../core/data-model/generic/sound-option';
import SectionPanel from '../../shared/panels/SectionPanel.vue';
import Checkbox from '../../shared/controls/Checkbox.vue';
import OptionDropdown from '../../shared/controls/OptionDropdown.vue';
import ValueSlider from '../../shared/controls/ValueSlider.vue';
import { SoundType } from '../../core/enums/sound-type.enum';

@Options({
    components: {
        SectionPanel,
        Checkbox,
        OptionDropdown,
        ValueSlider
    }
})
export default class SoundSettingsManager extends Vue {
    public readonly clockSounds = [
        { name: 'Bedroom', file: 'clock_tick_bedroom' },
        { name: 'Wrist Watch', file: 'clock_tick_wrist_watch' },
        { name: 'Vintage', file: 'clock_tick_vintage' },
        { name: 'Kitchen', file: 'clock_tick_kitchen' },
        { name: 'Mechanical', file: 'clock_tick_mechanical' }
    ];

    private updateDebounceTimer: NodeJS.Timeout | null = null;

    get options(): SoundSettingsOptions {
        return store.getters[`${settingsKey}/soundSettingsOptions`];
    }

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

    public onMuteToggle(isMuted: boolean): void {
        this.onSettingsChange('isMuted', isMuted);
        store.dispatch(`${soundKey}/${isMuted ? 'mute' : 'unmute'}`);
    }

    public onClockSoundChange(file: string): void {
        for (const sound of this.clockSounds) {
            store.dispatch(`${soundKey}/stopSound`, new SoundOption(sound.file, SoundType.Clock));
        }

        store.dispatch(`${soundKey}/playSound`, new SoundOption(file, SoundType.Clock, true));
        this.onSettingsChange('clockSound', file);
    }

    public onMasterVolumeChange(volume: number): void {
        this.onSettingsChange('masterVolume', volume);
        store.dispatch(`${soundKey}/setAllVolume`, { type: SoundType.All, volume });
    }

    public onUIVolumeChange(volume: number): void {
        this.onSettingsChange('uiVolume', volume);
        store.dispatch(`${soundKey}/setAllVolume`, { type: SoundType.UI, volume });
    }

    public onClockVolumeChange(volume: number): void {
        this.onSettingsChange('clockVolume', volume);
        store.dispatch(`${soundKey}/setAllVolume`, { type: SoundType.Clock, volume });
    }

    private onSettingsChange<T>(key: string, value: T): void {
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

        .master-slider {
            position: relative;

            .mute-toggle {
                display: flex;
                align-items: center;
                align-self: flex-end;
                position: absolute;
                top: 0.125rem;
                left: 25%;
                height: 1rem;
                font-size: 0.4rem;

                .checkbox {
                    margin-right: 0.175rem;
                    width: 0.525rem;
                    height: 0.525rem;
                }
            }

            .slider {
                width: 100%;
            }
        }

        .master-slider, .value-slider, .option-dropdown {
            width: 100%;

            &:not(:nth-last-child(1)) {
                margin-bottom: 2.5%;
            }
        }
    }
}
</style>
