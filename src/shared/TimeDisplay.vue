<template>
    <div class="time-display-container">
        <span>{{ dayOfWeek }}</span>

        <div class="time">
            <span>{{ hour }}</span>
            <span>{{ minute }}</span>
            <span>{{ second }}</span>
        </div>

        <div class="date">
            <span>{{ dayInMonth }}</span>
            <span>{{ month }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

import { TimeUtility } from '../core/utilities/time/time.utility';

export default class TimeDisplay extends Vue {
    private now = new Date();

    get hour(): string {
        return TimeUtility.prependZero(this.now.getHours());
    }

    get minute(): string {
        return TimeUtility.prependZero(this.now.getMinutes());
    }

    get second(): string {
        return TimeUtility.prependZero(this.now.getSeconds());
    }

    get dayInMonth(): string {
        return TimeUtility.prependZero(this.now.getDate());
    }

    get dayOfWeek(): string {
        return TimeUtility.getDayOfWeek(this.now.getDay());
    }

    get month(): string {
        return TimeUtility.getMonthName(this.now.getMonth()).slice(0, 3).toUpperCase();
    }

    public created(): void {
        this.updateTime();
    }

    private updateTime(): void {
        this.now = new Date();
        setTimeout(() => this.updateTime(), 1000);
    }
}
</script>

<style lang="scss" scoped>
.time-display-container {
    width: 100%;
    height: 100%;
    background-color: red;
    display: flex;
    flex-direction: column;

    .time, .date {
        display: flex;
    }
}
</style>
