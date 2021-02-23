<template>
    <div class="session-settings-manager-container">
        <section-panel class="section-panel" :name="'Session Settings'">
            <option-dropdown class="option-dropdown"
                :name="'Session Duration'">
            </option-dropdown>

            <option-dropdown class="option-dropdown"
                :name="'Short Break Duration'">
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

import SectionPanel from '../../shared/panels/SectionPanel.vue';
import OptionDropdown from '../../shared/controls/OptionDropdown.vue';

@Options({
    components: {
        SectionPanel,
        OptionDropdown
    }
})
export default class SessionSettingsManager extends Vue { }
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
