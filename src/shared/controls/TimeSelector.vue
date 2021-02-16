<template>
    <div class="time-selector-container">
        <span>{{ name }}</span>

        <div class="time">
            <span>{{ time[0] }}:</span>
            <span>{{ time[1] }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

class TimeSelectorProp {
    public name = prop<string>({ default: '' });
    public modelValue = prop<string>({ default: '23:59' });
}

@Options({
    emits: ['update:modelValue']
})
export default class TimeSelector extends Vue.with(TimeSelectorProp) {
    public time = this.modelValue ? this.modelValue.split(':') : [23, 59];
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
    background-color: rgba(52, 51, 56, 0.8);
    font-family: 'Jost';

    & > span {
        width: $name-width;
        font-size: 0.5rem;
    }

    .time {
        display: flex;
        justify-content: center;
        align-items: center;
        width: calc(100% - #{$name-width});
        font-size: 0.55rem;
    }
}
</style>
