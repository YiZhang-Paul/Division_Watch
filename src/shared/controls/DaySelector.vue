<template>
    <div class="day-selector-container">
        <span>{{ name }}</span>

        <div class="selections">
            <div :class="{ 'selected-day': selections.every(_ => _), 'disabled-day': isDisabled }"
                :style="{ 'animation-delay': delay / 1000 + 4 * 0.05 + 's' }"
                @click="onFullWeekToggle()">

                <span>All</span>
            </div>

            <div v-for="(selected, index) of selections"
                :key="index"
                :class="{ 'selected-day': selected, 'disabled-day': isDisabled }"
                :style="{ 'animation-delay': delay / 1000 + Math.abs(3 - index) * 0.05 + 's' }"
                @click="onSelect(index)">

                <span>{{ letters[index] }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import { GenericUtility } from '../../core/utilities/generic/generic.utility';

class DaySelectorProp {
    public name = prop<string>({ default: '' });
    public days = prop<boolean[]>({ default: [] });
    public delay = prop<number>({ default: 1250 });
    public isDisabled = prop<boolean>({ default: false });
}

@Options({
    emits: ['days:select']
})
export default class DaySelector extends Vue.with(DaySelectorProp) {
    public readonly letters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    get selections(): boolean[] {
        return this.days?.length === 7 ? this.days : this.getSelections();
    }

    public onFullWeekToggle(): void {
        if (!this.isDisabled) {
            this.$emit('days:select', this.getSelections(this.selections.some(_ => !_)));
        }
    }

    public onSelect(index: number): void {
        if (this.isDisabled) {
            return;
        }

        const selections = this.selections;
        const updated = GenericUtility.replaceAt(selections, !selections[index], index);
        this.$emit('days:select', updated);
    }

    private getSelections(selected = false): boolean[] {
        return new Array(7).fill(selected);
    }
}
</script>

<style lang="scss" scoped>
.day-selector-container {
    $name-width: 45%;

    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 1% 3.5%;
    color: rgb(255, 255, 255);
    background-color: rgba(52, 51, 56, 0.55);
    border-left: 1px solid rgba(200, 200, 200, 0.4);
    border-right: 1px solid rgba(200, 200, 200, 0.4);
    font-family: 'Jost';

    & > span {
        width: $name-width;
        font-size: 0.5rem;
    }

    .selections {
        box-sizing: border-box;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0 2%;
        width: calc(100% - #{$name-width});
        font-size: 0.475rem;
        font-family: 'Jost';

        & > div {
            $border-width: 1px;

            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0.375%;
            width: calc(0.775rem - #{$border-width} * 2);
            height: calc(0.775rem - #{$border-width} * 2);
            border: $border-width solid rgb(195, 195, 195);
            background-color: rgba(45, 45, 45, 0.7);
            opacity: 0;
            transition: background-color 0.3s;
            animation: revealContent 0.3s ease forwards;

            &:nth-child(1) {
                width: calc(1.05rem - #{$border-width} * 2);
            }

            &:nth-child(1), &:nth-child(2), &:nth-last-child(1) {
                color: rgb(74, 236, 223);
            }

            &:hover:not(.disabled-day) {
                cursor: pointer;
                background-color: rgba(105, 105, 105, 0.6);
            }

            &.selected-day, &.selected-day:hover {
                background-color: rgb(228, 122, 47);
            }

            &.disabled-day {
                cursor: not-allowed;
            }
        }
    }
}
</style>days:select
