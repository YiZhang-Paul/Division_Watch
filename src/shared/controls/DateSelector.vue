<template>
    <div class="date-selector-container">
        <span>{{ name }}</span>

        <div class="dates">
            <div class="dates-wrapper" :class="{ 'active-wrapper': isActive }">
                <div class="current-date-wrapper" @click="isActive = !isActive">
                    <span>{{ monthAndDate }}</span>
                    <span class="date-suffix">{{ suffix }}</span>
                    <span>, {{ selected.getFullYear() }}</span>
                </div>

                <div v-if="isActive" class="selection-panel">
                    <div class="month-selection">
                        <chevron-left class="page-arrow"
                            :class="{ 'disabled-arrow': !allowPreviousMonth }"
                            @click="moveMonth(false)" />

                        <span>{{ monthAndYear }}</span>
                        <chevron-right class="page-arrow" @click="moveMonth(true)" />
                    </div>

                    <div class="day-headers">
                        <div class="header" v-for="letter in letters" :key="letter">
                            <span>{{ letter }}</span>
                        </div>
                    </div>

                    <div class="row" v-for="row in rows" :key="row">
                        <div class="day"
                            v-for="column in 7"
                            :key="column"
                            :class="getDayOptionClasses(row, column)"
                            @click="onDateSelect(row, column)">

                            <span>{{ getDate(row, column).getDate() }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { ChevronLeft, ChevronRight } from 'mdue';

import { TimeUtility } from '../../core/utilities/time/time.utility';

class DateSelectorProp {
    public name = prop<string>({ default: '' });
    public modelValue = prop<Date>({ default: null });
}

@Options({
    components: {
        ChevronLeft,
        ChevronRight
    },
    emits: ['update:modelValue']
})
export default class DateSelector extends Vue.with(DateSelectorProp) {
    public readonly letters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    public days = [31, -1, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    public selected = this.modelValue ?? new Date();
    public year = this.selected.getFullYear();
    public month = this.selected.getMonth() + 1;
    public date = this.selected.getDate();
    public columnOffset = 0;
    public rowOffset = 0;
    public rows = 0;
    public isActive = false;

    get allowPreviousMonth(): boolean {
        const now = new Date();

        return this.year > now.getFullYear() || this.month > now.getMonth() + 1;
    }

    get monthAndDate(): string {
        return `${TimeUtility.getMonthName(this.selected.getMonth())} ${this.selected.getDate()}`;
    }

    get monthAndYear(): string {
        return `${TimeUtility.getMonthName(this.month - 1).slice(0, 3)} ${this.year}`;
    }

    get suffix(): string {
        return TimeUtility.getDateSuffix(this.selected.getDate());
    }

    public created(): void {
        this.setConstraints();
    }

    public moveMonth(isNext: boolean): void {
        if (!isNext && !this.allowPreviousMonth) {
            return;
        }

        if (isNext && this.month === 12) {
            this.year++;
            this.month = 1;
        }
        else if (!isNext && this.month === 1) {
            this.year--;
            this.month = 12;
        }
        else {
            this.month += isNext ? 1 : -1;
        }

        this.setConstraints();
    }

    public getDayOptionClasses(row: number, column: number): { [key: string]: boolean } {
        const now = new Date();
        const date = this.getDate(row, column);

        return {
            'unselectable-day': !this.isSelectable(date),
            'today': now.toLocaleDateString() === date.toLocaleDateString(),
            'selected-day': this.selected.toLocaleDateString() === date.toLocaleDateString()
        };
    }

    public onDateSelect(row: number, column: number): void {
        const date = this.getDate(row, column);

        if (this.isSelectable(date)) {
            this.$emit('update:modelValue', date);
        }
    }

    public getDate(row: number, column: number): Date {
        const dayCount = (this.rowOffset + row - 1) * 7 + column;

        if (dayCount <= this.columnOffset) {
            return new Date(this.year - 1, 11, dayCount - this.columnOffset + this.days.slice(-1)[0]);
        }

        const dayOffset = dayCount - this.getPrefixSum(this.month);

        if (dayOffset <= 0) {
            return new Date(this.year, this.month - 2, this.days[this.month - 2] + dayOffset);
        }
        else if (dayOffset <= this.days[this.month - 1]) {
            return new Date(this.year, this.month - 1, dayOffset);
        }
        else if (this.month === 12) {
            return new Date(this.year + 1, 1, dayOffset - this.days[this.month - 1]);
        }

        return new Date(this.year, this.month + 1, dayOffset - this.days[this.month - 1]);
    }

    private isSelectable(date: Date): boolean {
        return this.month === date.getMonth() + 1 && date.getTime() >= Date.now();
    }

    private setConstraints(): void {
        this.days[1] = TimeUtility.isLeapYear(this.year) ? 29 : 28;
        this.columnOffset = new Date(this.year, 0, 1).getDay();
        this.rowOffset = Math.floor(this.getPrefixSum(this.month) / 7);
        this.rows = Math.floor((this.getPrefixSum(this.month + 1) - 1) / 7) - this.rowOffset + 1;
    }

    private getPrefixSum(month: number, includeOffset = true): number {
        const offset = includeOffset ? this.columnOffset : 0;

        return this.days.slice(0, month - 1).reduce((total, _) => _ + total, 0) + offset;
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
        display: flex;
        justify-content: center;
        width: calc(100% - #{$name-width});

        .dates-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
            font-size: 0.4rem;

            &.active-wrapper .current-date-wrapper {
                color: rgb(240, 123, 14);
            }

            .current-date-wrapper {
                box-sizing: border-box;
                display: flex;
                align-items: center;
                padding: 1.35% 5.5%;
                width: 100%;
                height: 100%;
                border-radius: 3px;
                background-color: rgba(29, 29, 32, 0.8);
                background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='30' viewBox='0 0 24 24' width='30' xmlns='http://www.w3.org/2000/svg'><path d='M5 8l6 10 6-10z' fill='rgb(228, 122, 47)' /><path d='M0 0h24v24H0z' fill='none'/></svg>");
                background-repeat: no-repeat;
                background-position-x: 100%;
                transition: background-color 0.3s, color 0.3s;

                &:hover {
                    cursor: pointer;
                    background-color: rgba(42, 42, 48, 0.8);
                    color: rgb(240, 123, 14);
                }

                .date-suffix {
                    align-self: flex-start;
                    margin-left: 0.025rem;
                    font-size: 0.325rem;
                }
            }

            .selection-panel {
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                align-items: center;
                position: absolute;
                z-index: 999;
                top: 105%;
                padding: 3% 4.5% 4% 4.5%;
                width: 100%;
                background-color: rgb(42, 42, 48);
                font-size: 0.45rem;

                .month-selection {
                    box-sizing: border-box;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    padding: 0 3%;
                    margin-bottom: 1.75%;
                    width: 100%;
                    color: rgb(225, 225, 225);
                    font-size: 0.5rem;

                    .page-arrow {
                        font-size: 0.7rem;
                        transition: color 0.2s;

                        &:hover {
                            cursor: pointer;
                            color: rgb(240, 123, 14);
                        }

                        &.disabled-arrow, &.disabled-arrow:hover {
                            cursor: default;
                            color: rgb(135, 135, 135);
                        }
                    }
                }

                .day-headers, .row {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                }

                .day-headers {
                    margin-bottom: 1.25%;
                    height: 1rem;

                    .header {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 1rem;
                        height: 1rem;
                        color: rgb(225, 225, 225);

                        &:nth-child(1), &:nth-last-child(1) {
                            color: rgb(74, 236, 223);
                        }
                    }
                }

                .row {
                    margin-bottom: 0.75%;

                    .day {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 1rem;
                        height: 1rem;
                        transition: background-color 0.1s, color 0.1s;

                        &:not(.unselectable-day):hover {
                            cursor: pointer;
                            background-color: rgb(240, 123, 14);
                        }

                        &.unselectable-day {
                            color: rgb(135, 135, 135);
                            transition: none;
                        }

                        &.today {
                            background-color: rgba(135, 135, 135, 0.3);
                        }

                        &.selected-day {
                            background-color: rgb(240, 123, 14);
                            color: rgb(0, 0, 0);
                        }
                    }
                }
            }
        }
    }
}
</style>
