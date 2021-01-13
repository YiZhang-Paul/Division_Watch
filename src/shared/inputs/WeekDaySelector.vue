<template>
    <div class="week-day-selector-container">
        <div v-for="(selected, index) of selections"
            :key="index"
            :class="{ 'selected': selected }"
            :style="{ 'animation-delay': delay + Math.abs(3 - index) * 0.05 + 's' }"
            @click="onSelect(index)">

            {{ letters[index] }}
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

class WeekDaySelectorProp {
    public days = prop<boolean[]>({ default: [] });
    public delay = prop<number>({ default: 1.5 });
}

@Options({
    emits: ['days:select']
})
export default class WeekDaySelector extends Vue.with(WeekDaySelectorProp) {
    public letters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    get selections(): boolean[] {
        return this.days?.length === 7 ? this.days : new Array(7).fill(false);
    }

    public onSelect(index: number): void {
        const selections = this.selections;
        const updated = [...selections.slice(0, index), !selections[index], ...selections.slice(index + 1)];
        this.$emit('days:select', updated);
    }
}
</script>

<style lang="scss" scoped>
.week-day-selector-container {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    color: rgb(255, 255, 255);
    font-family: 'Bruno Ace';

    & > div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2.25em;
        height: 2.25em;
        border: 1px solid rgb(255, 255, 255);
        border-radius: 50%;
        background-color: rgba(63, 62, 68, 0.6);
        opacity: 0;
        transition: background-color 0.3s;
        animation: revealContent 0.3s ease forwards;

        &:hover {
            cursor: pointer;
            background-color: rgba(105, 105, 105, 0.6);
        }

        &.selected {
            background-color: rgb(228, 122, 47);
        }
    }
}
</style>
