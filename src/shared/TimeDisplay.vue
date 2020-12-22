<template>
    <div class="time-display-container">
        <span>{{ dayOfWeek }}</span>

        <div class="time">
            <div class="placeholder">
                <span>88</span>
                <span>88</span>
                <span class="second">88</span>
            </div>

            <div>
                <span>{{ hour }}</span>
                <span>{{ minute }}</span>
                <span class="second">{{ second }}</span>
            </div>
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 100%;
    font-family: 'Bruno Ace';
    font-size: 3rem;
    color: rgb(211, 112, 19);

    .time, .date {
        display: flex;
    }

    .time {
        position: relative;
        font-family: 'Digital Numbers';
        font-size: 6.5rem;

        div {
            display: flex;
            align-items: flex-end;
        }

        .placeholder {
            position: absolute;
            color: rgba(85, 85, 85, 0.1);
        }

        .second {
            margin-bottom: 0.4rem;
            font-size: 2.75rem;
        }
    }

    .date {
        font-size: 2.5rem;
        color: rgb(255, 255, 255);

        span:last-of-type {
            margin-left: 2rem;
        }
    }
}
</style>
