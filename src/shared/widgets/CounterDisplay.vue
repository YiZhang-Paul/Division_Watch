<template>
    <div class="counter-display-container">
        <span class="placeholder">{{ leadingZeros }}</span>
        <span>{{ displayValue }}</span>
        <span v-if="isOverflow" class="overflow-indicator">+</span>
    </div>
</template>

<script lang="ts">
import { GenericUtility } from '@/core/utilities/generic/generic.utility';
import { Vue, prop } from 'vue-class-component';

class CounterDisplayProp {
    public value = prop<number>({ default: 0 });
    public digits = prop<number>({ default: 3 });
}

export default class CounterDisplay extends Vue.with(CounterDisplayProp) {

    get leadingZeros(): string {
        return GenericUtility.getLeadingZeros(Math.round(this.value));
    }

    get isOverflow(): boolean {
        return String(Math.round(this.value)).length > this.digits;
    }

    get displayValue(): string {
        const value = String(Math.round(this.value));

        return value.length > this.digits ? '9'.repeat(this.digits) : value;
    }
}
</script>

<style lang="scss" scoped>
.counter-display-container {
    display: flex;
    align-items: center;
    position: relative;
    color: rgb(255, 255, 255);
    font-size: inherit;
    transition: color 0.3s;

    .placeholder {
        color: rgba(225, 225, 225, 0.25);
        transition: color 0.3s;
    }

    .overflow-indicator {
        position: absolute;
        top: 0.05rem;
        right: -0.325rem;
        line-height: 0.45rem;
        font-size: 0.45rem;
    }
}
</style>
