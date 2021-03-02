<template>
    <div v-if="goal && options" class="goal-selector-container">
        <section-panel class="section-panel" :name="date">
            <value-slider class="control-item"
                :name="'Goal'"
                :min="options.sessions.min"
                :max="options.sessions.max"
                :steps="options.sessions.max - options.sessions.min"
                :selected="goal.sessions"
                :transform="getSessionTotalText"
                @change="onGoalChange($event, options.sessionDuration)">
            </value-slider>

            <value-difference class="control-item"
                :name="'Total'"
                :current="0"
                :target="goal.sessions * goal.sessionDuration"
                :valueTransform="getSessionDifferenceText"
                :differenceTransform="getSessionDifferenceText">
            </value-difference>
        </section-panel>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import { Goal } from '../../core/data-model/generic/goal';
// eslint-disable-next-line no-unused-vars
import { GoalOptions } from '../../core/data-model/generic/goal-options';
import SectionPanel from '../../shared/panels/SectionPanel.vue';
import ValueSlider from '../../shared/controls/ValueSlider.vue';
import ValueDifference from '../../shared/controls/ValueDifference.vue';
import { TimeUtility } from '../../core/utilities/time/time.utility';

class GoalSelectorProp {
    public goal = prop<Goal>({ default: null });
    public options = prop<GoalOptions>({ default: null });
}

@Options({
    components: {
        SectionPanel,
        ValueSlider,
        ValueDifference
    },
    emits: ['select']
})
export default class GoalSelector extends Vue.with(GoalSelectorProp) {

    get date(): string {
        return TimeUtility.toLongDateString(new Date());
    }

    public onGoalChange(sessions: number, duration: number): void {
        this.$emit('select', { sessions, sessionDuration: duration } as Goal);
    }

    public getSessionDifferenceText(time: number): string {
        const sessions = time / this.goal.sessionDuration;
        const hours = TimeUtility.toMinutes(time) / 60;
        const hourText = `${hours ? hours.toFixed(1) : '0'} hour${hours > 1 ? 's' : ''}`;

        return `${this.getSessionTotalText(sessions)}/${hourText}`;
    }

     public getSessionTotalText(total: number): string {
        return `${total} session${total > 1 ? 's' : ''}`;
    }
}
</script>

<style lang="scss" scoped>
.goal-selector-container {

    .section-panel {
        width: 100%;

        .control-item {
            width: 100%;
        }

        .control-item:not(:nth-last-child(1)) {
            margin-bottom: 1%;
        }
    }
}
</style>
