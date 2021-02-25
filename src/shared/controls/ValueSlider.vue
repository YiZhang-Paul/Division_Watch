<template>
    <div class="value-slider-container" :style="{ '--filler-width': fillerWidth * 100 + '%' }">
        <span>{{ name }}</span>

        <div class="slider-wrapper">
            <span>{{ transform ? transform(selected) : selected }}</span>

            <div class="slider" ref="slider" @click="onSelect($event)">
                <div class="filler" @click="onSelect($event)"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

class ValueSliderProp {
    public name = prop<string>({ default: '' });
    public min = prop<number>({ default: 0 });
    public max = prop<number>({ default: 100 });
    public steps = prop<number>({ default: 100 });
    public selected = prop<number>({ default: 0 });
    public transform = prop<(_: number) => string>({ default: null });
}

@Options({
    emits: ['change']
})
export default class ValueSlider extends Vue.with(ValueSliderProp) {
    public fillerWidth = 0;

    public onSelect(event: any): void {
        const slider = this.$refs.slider as HTMLElement;
        const mouseX = (event.clientX - slider.getBoundingClientRect().left) / slider.offsetWidth;
        const percent = Math.max(0, Math.min(mouseX * 100, 100));
        const currentStep = Math.round(percent / 100 * this.steps);
        this.fillerWidth = currentStep / this.steps;
        this.$emit('change', (this.max - this.min) * this.fillerWidth + this.min);
    }
}
</script>

<style lang="scss" scoped>
.value-slider-container {
    --filler-width: 0;
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

    .slider-wrapper {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 0.75% 0 0.75% 1.25%;
        width: calc(100% - #{$name-width});
        height: 0.825rem;
        color: rgb(255, 255, 255);
        font-size: 0.4rem;

        & > span {
            width: 17.5%;
        }

        .slider {
            width: 82.5%;
            height: 37.5%;
            border-left: 2px solid rgba(200, 200, 200, 0.7);
            border-right: 2px solid rgba(200, 200, 200, 0.7);
            background-color: rgba(45, 45, 45, 0.7);

            &:hover {
                cursor: pointer;
                background-color: rgba(42, 42, 48, 0.8);
            }

            .filler {
                width: var(--filler-width);
                height: 100%;
                background-color: rgb(240, 123, 14);
            }
        }
    }
}
</style>
