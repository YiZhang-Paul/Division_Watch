<template>
    <div class="value-slider-container" :style="{ '--filler-width': fillerWidth * 100 + '%' }">
        <span>{{ name }}</span>

        <div class="slider-wrapper">
            <span>{{ transform ? transform(selected) : selected }}</span>

            <div class="inner-wrapper">
                <div class="border"></div>

                <div class="drag-panel"
                    @mouseleave="isMousedown = false"
                    @mousemove.stop.self="onMousemove($event)">

                    <div class="slider"
                        :class="{ 'active-slider': isMousedown }"
                        ref="slider"
                        @mouseup="isMousedown = false"
                        @mousedown.self="onMousedown($event)"
                        @mousemove.self="onMousemove($event)">

                        <div class="filler"
                            @mouseup="isMousedown = false"
                            @mousedown.stop.self="onMousedown($event, 'decrease')"
                            @mousemove.stop.self="onMousemove($event)">
                        </div>

                        <div class="handle"
                            @mouseup="isMousedown = false"
                            @mousedown.stop.self="isMousedown = true">
                        </div>
                    </div>
                </div>

                <div class="border"></div>
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
    public isMousedown = false;

    get fillerWidth(): number {
        return this.currentStep / this.steps;
    }

    get currentStep(): number {
        const step = (this.selected - this.min) / (this.max - this.min) * this.steps;

        return Math.max(0, isNaN(step) ? 0 : step);
    }

    public onMousedown(event: MouseEvent, type = 'increase'): void {
        this.isMousedown = true;
        this.onSelect(event, type);
    }

    public onMousemove(event: MouseEvent): void {
        if (this.isMousedown) {
            this.onSelect(event, 'round');
        }
    }

    private onSelect(event: MouseEvent, type: string): void {
        let width = 0;
        const slider = this.$refs.slider as HTMLElement;
        const mouseX = (event.clientX - slider.getBoundingClientRect().left) / slider.offsetWidth;
        const percent = Math.round(Math.max(0, Math.min(mouseX, 1)) * this.steps);

        if (type === 'increase') {
            width = Math.min(Math.max(this.currentStep + 1, percent), this.steps) / this.steps;
        }
        else if (type === 'decrease') {
            width = Math.max(0, Math.min(percent, this.currentStep - 1)) / this.steps;
        }
        else if (type === 'round') {
            width = Math.min(percent, this.steps) / this.steps;
        }

        this.$emit('change', (this.max - this.min) * width + this.min);
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
        box-sizing: border-box;
        display: flex;
        align-items: center;
        padding: 0.75% 0 0.75% 1.25%;
        width: calc(100% - #{$name-width});
        height: 0.825rem;
        color: rgb(255, 255, 255);
        font-size: 0.4rem;

        & > span {
            width: 17.5%;
        }

        .inner-wrapper {
            display: flex;
            position: relative;
            width: 82.5%;
            height: 42.5%;

            .border {
                width: 2px;
                height: 100%;
                background-color: rgba(235, 235, 235, 0.45);
            }

            .drag-panel {
                display: flex;
                flex-grow: 1;
                align-items: center;
                position: absolute;
                left: 0;
                bottom: -350%;
                width: 100%;
                height: 800%;
            }

            .slider {
                position: relative;
                width: 100%;
                height: 12.5%;
                background-color: rgba(45, 45, 45, 0.7);

                &:hover {
                    cursor: pointer;
                    background-color: rgba(42, 42, 48, 0.8);
                }

                &:hover .filler, &.active-slider .filler {
                    background-color: rgb(240, 123, 14);
                }

                &:hover .handle, &.active-slider .handle {
                    $width: 0.25rem;
                    $height: 0.625rem;

                    left: calc(var(--filler-width) - #{$width} / 2);
                    bottom: calc(#{$height} / -2 + 50%);
                    width: $width;
                    height: $height;
                    border-radius: 1px;
                    background-color: rgb(243, 105, 26);
                }

                .filler {
                    width: var(--filler-width);
                    height: 100%;
                    background-color: rgb(220, 220, 220);
                    transition: background-color 0.1s, width 0.1s;
                }

                .handle {
                    $width: 2px;
                    $height: calc(#{$width} / 2 * 3);

                    position: absolute;
                    left: calc(var(--filler-width) - #{$width} / 2);
                    bottom: calc(#{$height} * -1 - 0.025rem);
                    width: $width;
                    height: $height;
                    background-color: rgb(220, 220, 220);
                    transition: all 0.1s;
                }
            }
        }
    }
}
</style>
