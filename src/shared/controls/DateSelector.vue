<template>
    <div class="date-selector-container">
        <span>{{ name }}</span>

        <div class="dates">
            <span>{{ current }}</span>

            <div class="row" v-for="row in rows" :key="row">
                <div class="day" v-for="day in 7" :key="day"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

class DateSelectorProp {
    public name = prop<string>({ default: '' });
    public modelValue = prop<Date>({ default: null });
}

@Options({
    emits: ['update:modelValue']
})
export default class DateSelector extends Vue.with(DateSelectorProp) {
    public readonly days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    public selected = this.modelValue ?? new Date();
    public year = this.selected.getFullYear();
    public month = this.selected.getMonth() + 1;
    public date = this.selected.getDate();

    get current(): string {
        return `${this.date}, ${this.year}`;
    }

    get rows(): number {
        return Math.ceil(this.days[this.month - 1] / 7);
    }
}
</script>

<style lang="scss" scoped>
.date-selector-container {
    $name-width: 45%;

    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 1% 3.5%;
    color: rgb(255, 255, 255);
    background-color: rgba(52, 51, 56, 0.8);
    font-family: 'Jost';

    & > span {
        width: $name-width;
        font-size: 0.5rem;
    }

    .dates {
        padding: 0.75% 3%;

        .row {
            display: flex;

            .day {
                margin: 0.025rem;
                width: 1rem;
                height: 1rem;
                border: 1px solid rgba(200, 200, 200, 0.7);
            }
        }
    }
}
</style>
