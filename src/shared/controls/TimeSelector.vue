<template>
    <div class="time-selector-container">
        <span>{{ name }}</span>

        <div class="time">
            <input type="number"
                :id="hourId"
                :min="minValue"
                :max="maxHour"
                v-model="hour"
                @input="onTimeChange()" />

            <span class="separator">:</span>

            <input type="number"
                :id="minuteId"
                :min="minValue"
                :max="maxMinute"
                v-model="minute"
                @input="onTimeChange()" />

            <menu-button class="reset-button" @click="reset()">reset</menu-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import * as uuid from 'uuid';

import MenuButton from './MenuButton.vue';

class TimeSelectorProp {
    public name = prop<string>({ default: '' });
    public modelValue = prop<string>({ default: '23:59' });
}

@Options({
    components: { MenuButton },
    watch: {
        modelValue(current: string): void {
            this.hour = this.maxHour;
            this.minute = this.maxMinute;

            if (current) {
                [this.hour, this.minute] = current.split(':').map(Number);
                this.onTimeChange(false);
            }
        }
    },
    emits: ['update:modelValue']
})
export default class TimeSelector extends Vue.with(TimeSelectorProp) {
    public readonly hourId = `hour-id-${uuid.v4()}`;
    public readonly minuteId = `minute-id-${uuid.v4()}`;
    public readonly minValue = 0;
    public readonly maxHour = 23;
    public readonly maxMinute = 59;
    public hour = this.maxHour;
    public minute = this.maxMinute;

    public mounted(): void {
        if (this.modelValue) {
            [this.hour, this.minute] = this.modelValue.split(':').map(Number);
            this.onTimeChange(false);
        }
    }

    public reset(): void {
        this.hour = this.maxHour;
        this.minute = this.maxMinute;
        this.onTimeChange();
    }

    public onTimeChange(emit = true): void {
        this.hour = Math.min(this.maxHour, Math.max(this.minValue, this.hour));
        this.minute = Math.min(this.maxMinute, Math.max(this.minValue, this.minute));
        this.setValue(this.hourId, this.hour);
        this.setValue(this.minuteId, this.minute);

        setTimeout(() => {
            this.setValue(this.hourId, this.hour);
            this.setValue(this.minuteId, this.minute);
        });

        if (emit) {
            this.$emit('update:modelValue', `${this.hour}:${this.minute}`);
        }
    }

    private setValue(id: string, value: number): void {
        const input = document.querySelector(`#${id}`) as HTMLInputElement;
        input.value = `${value < 10 ? '0' : ''}${value}`;
    }
}
</script>

<style lang="scss" scoped>
.time-selector-container {
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

    .time {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        width: calc(100% - #{$name-width});

        input {
            padding: 0.1% 0 0.1% 0.15rem;
            width: 1.1rem;
            outline: none;
            border: none;
            background-color: rgba(45, 45, 45, 0.4);
            color: rgb(255, 255, 255);
            font-size: 0.55rem;
            font-family: 'Play';
        }

        .separator {
            margin: 0 0.1rem;
            font-size: 0.5rem;
            font-weight: 600;
        }

        .reset-button {
            position: absolute;
            right: 5%;
            width: 20%;
            font-size: 0.45rem;
        }
    }
}
</style>
