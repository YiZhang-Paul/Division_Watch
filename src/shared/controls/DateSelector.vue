<template>
    <div class="date-selector-container">
        <span>{{ name }}</span>

        <div class="dates">
            <div class="dates-wrapper" :class="{ 'active-wrapper': isActive }">
                <div class="current-date-wrapper" @click="isActive = !isActive">
                    <span>{{ selectedMonthAndDate }}</span>
                    <span class="date-suffix">{{ selectedDateSuffix }}</span>
                    <span>, {{ selected.getFullYear() }}</span>
                </div>

                <div v-if="isActive" class="selection-panel">
                    <div class="month-selection">
                        <chevron-left class="page-arrow"
                            :class="{ 'disabled-arrow': !allowPreviousMonth }"
                            @click="moveMonth(false)" />

                        <span>{{ panelMonthAndYear }}</span>
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
    public selected = this.modelValue ? new Date(this.modelValue) : new Date();
    public panelDate = new Date(this.selected);
    public isActive = false;
    public rows = 0;
    private columnOffset = 0;
    private rowOffset = 0;

    get selectedMonthAndDate(): string {
        return `${TimeUtility.getMonthName(this.selected.getMonth())} ${this.selected.getDate()}`;
    }

    get selectedDateSuffix(): string {
        return TimeUtility.getDateSuffix(this.selected.getDate());
    }

    get allowPreviousMonth(): boolean {
        const now = new Date();

        return this.panelDate.getFullYear() > now.getFullYear() || this.panelDate.getMonth() > now.getMonth();
    }

    get panelMonthAndYear(): string {
        const month = TimeUtility.getMonthName(this.panelDate.getMonth());

        return `${month.slice(0, 3)} ${this.panelDate.getFullYear()}`;
    }

    public created(): void {
        this.setConstraints();
    }

    public moveMonth(isNext: boolean): void {
        if (!isNext && !this.allowPreviousMonth) {
            return;
        }

        if (isNext && this.panelDate.getMonth() === 11) {
            this.panelDate = new Date(this.panelDate.getFullYear() + 1, 0);
        }
        else if (!isNext && !this.panelDate.getMonth()) {
            this.panelDate = new Date(this.panelDate.getFullYear() - 1, 11);
        }
        else {
            const month = this.panelDate.getMonth() + (isNext ? 1 : -1);
            this.panelDate = new Date(this.panelDate.getFullYear(), month);
        }

        this.setConstraints();
    }

    public getDayOptionClasses(row: number, column: number): { [key: string]: boolean } {
        const date = this.getDate(row, column);

        return {
            'unselectable-day': !this.isSelectable(date),
            'today': new Date().toLocaleDateString() === date.toLocaleDateString(),
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
        const [month, year] = [this.panelDate.getMonth(), this.panelDate.getFullYear()];
        const dayCount = (this.rowOffset + row - 1) * 7 + column;

        if (dayCount <= this.columnOffset) {
            return new Date(year - 1, 11, dayCount - this.columnOffset + this.days.slice(-1)[0]);
        }

        const dayOffset = dayCount - this.getPrefixSum(month);

        if (dayOffset <= 0) {
            return new Date(year, month - 1, this.days[month - 1] + dayOffset);
        }
        else if (dayOffset <= this.days[month]) {
            return new Date(year, month, dayOffset);
        }
        else if (month === 11) {
            return new Date(year + 1, 0, dayOffset - this.days[month]);
        }

        return new Date(year, month + 1, dayOffset - this.days[month]);
    }

    private isSelectable(date: Date): boolean {
        return this.panelDate.getMonth() === date.getMonth() && date.getTime() >= Date.now();
    }

    private setConstraints(): void {
        const [month, year] = [this.panelDate.getMonth(), this.panelDate.getFullYear()];
        this.days[1] = TimeUtility.isLeapYear(year) ? 29 : 28;
        this.columnOffset = new Date(year, 0, 1).getDay();
        this.rowOffset = Math.floor(this.getPrefixSum(month) / 7);
        this.rows = Math.floor((this.getPrefixSum(month + 1) - 1) / 7) - this.rowOffset + 1;
    }

    private getPrefixSum(month: number, includeOffset = true): number {
        const offset = includeOffset ? this.columnOffset : 0;

        return this.days.slice(0, month).reduce((total, _) => _ + total, 0) + offset;
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
