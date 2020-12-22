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

export default class TimeDisplay extends Vue {
    public month = 0;
    public hour = 0;
    public minute = 0;
    public second = 0;
    public dayOfWeek = 0;
    public dayInMonth = 0;

    public created(): void {
        this.calculateTime();
    }

    public calculateTime(): void {
        const now = new Date();
        this.month = now.getMonth() + 1;
        this.hour = now.getHours();
        this.minute = now.getMinutes();
        this.second = now.getSeconds();
        this.dayOfWeek = now.getDay();
        this.dayInMonth = now.getDate();
        setTimeout(() => this.calculateTime(), 1000);
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
