<template>
    <div class="date-selector-container" ref="container">
        <span>{{ name }}</span>

        <div class="dates">
            <div class="dates-wrapper">
                <div class="current-date-wrapper" @click="toggleSelection()">
                    <template v-if="selected">
                        <span>{{ selectedMonthAndDate }}</span>
                        <span class="date-suffix">{{ selectedDateSuffix }}</span>
                        <span>, {{ selected.getFullYear() }}</span>
                        <close-circle-outline class="clear-button" @click.stop="$emit('update:modelValue', null)" />
                    </template>

                    <span v-if="!selected">N/A</span>
                </div>

                <div v-if="isActive" :id="id" class="selection-panel" @blur="onBlur()">
                    <div class="month-selection">
                        <chevron-left class="page-arrow"
                            :class="{ 'disabled-arrow': !allowPreviousMonth }"
                            @click="moveMonth(false)" />

                        <span>{{ panelMonthAndYear }}</span>
                        <chevron-right class="page-arrow" @click="moveMonth(true)" />
                    </div>

                    <div class="day-headers">
                        <div class="header"
                            v-for="(letter, index) in letters"
                            :key="letter"
                            :style="{ 'animation-delay': 0.1 + Math.abs(3 - index) * 0.025 + 's' }">

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
import { ChevronLeft, ChevronRight, CloseCircleOutline } from 'mdue';
import VanillaTilt from 'vanilla-tilt';
import * as uuid from 'uuid';

import { TimeUtility } from '../../core/utilities/time/time.utility';

class DateSelectorProp {
    public name = prop<string>({ default: '' });
    public modelValue = prop<Date>({ default: null });
}

@Options({
    components: {
        ChevronLeft,
        ChevronRight,
        CloseCircleOutline
    },
    emits: ['update:modelValue']
})
export default class DateSelector extends Vue.with(DateSelectorProp) {
    public readonly id = `date-selection-panel-${uuid.v4()}`;
    public readonly letters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    public days = [31, -1, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    public panelDate = this.selected ? new Date(this.selected) : new Date();
    public isActive = false;
    public rows = 0;
    private columnOffset = 0;
    private rowOffset = 0;

    get selected(): Date | null {
        return this.modelValue ? new Date(this.modelValue) : null;
    }

    get selectedMonthAndDate(): string {
        return this.selected ? `${TimeUtility.getMonthName(this.selected.getMonth())} ${this.selected.getDate()}` : '';
    }

    get selectedDateSuffix(): string {
        return this.selected ? TimeUtility.getDateSuffix(this.selected.getDate()) : '';
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

    public mounted(): void {
        document.addEventListener('click', this.onClickOutside);
    }

    public beforeUnmount(): void {
        document.removeEventListener('click', this.onClickOutside);
    }

    public toggleSelection(): void {
        this.isActive = !this.isActive;

        if (this.isActive) {
            setTimeout(() => {
                const panel = document.querySelector(`#${this.id}`);
                VanillaTilt.init(panel as HTMLElement, { max: 0, glare: true, 'max-glare': 0.1 });
            });
        }
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
            'selected-day': this.selected?.toLocaleDateString() === date.toLocaleDateString()
        };
    }

    public onDateSelect(row: number, column: number): void {
        const date = this.getDate(row, column);

        if (this.isSelectable(date)) {
            this.isActive = false;
            this.$emit('update:modelValue', date);
        }
    }

    public onClickOutside(event: Event): void {
        const path = event.composedPath();
        const container = this.$refs.container as HTMLElement;
        const target = event.target as HTMLElement;

        if (path && !path.includes(container) && !container.contains(target)) {
            this.isActive = false;
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
        const [year, month] = [this.panelDate.getFullYear(), this.panelDate.getMonth()];

        if (date.getFullYear() !== year || date.getMonth() !== month) {
            return false;
        }

        const target = date.toLocaleDateString().split('/').reverse().join('/');
        const current = new Date().toLocaleDateString().split('/').reverse().join('/');

        return target >= current;
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
                transition: background-color 0.3s;

                &:hover {
                    cursor: pointer;
                    background-color: rgba(42, 42, 48, 0.8);
                }

                span, .clear-button {
                    opacity: 0;
                    animation: revealContent 0.2s ease 0.1s forwards;
                }

                .date-suffix {
                    align-self: flex-start;
                    margin-left: 0.025rem;
                    font-size: 0.325rem;
                }

                .clear-button {
                    margin-left: 0.1rem;
                    color: rgb(230, 134, 44);
                    font-size: 0.475rem;
                    transition: color 0.3s;

                    &:hover {
                        cursor: pointer;
                        color: rgb(230, 26, 60);
                    }
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
                opacity: 0;
                animation: revealContent 0.2s ease forwards;

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
                        opacity: 0;
                        animation: revealContent 0.2s ease forwards;

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
