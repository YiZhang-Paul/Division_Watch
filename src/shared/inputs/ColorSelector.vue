<template>
    <div class="color-selector-container">
        <div v-for="(color, index) of colors"
            :key="index"
            :class="{ 'active': isActive(color) }"
            :style="getOptionStyle(color, index)"
            @click="$emit('color:select', color)">
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import { Color } from '../../core/data-model/color';

class ColorSelectorProp {
    public active = prop<Color>({ default: [] });
    public colors = prop<Color[]>({ default: [] });
    public delay = prop<number>({ default: 1.5 });
}

@Options({
    emits: ['color:select']
})
export default class ColorSelector extends Vue.with(ColorSelectorProp) {

    public isActive(color: Color): boolean {
        return Boolean(this.active) && Color.toString(this.active) === Color.toString(color);
    }

    public getOptionStyle(color: Color, index: number): { [key: string]: string } {
        return {
            'background-color': Color.toString(color),
            'animation-delay': `${this.delay + Math.abs(4.5 - index) * 0.05}s`
        };
    }
}
</script>

<style lang="scss" scoped>
.color-selector-container {
    display: flex;
    justify-content: space-around;
    align-items: center;

    & > div {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        filter: brightness(0.85);
        opacity: 0;
        animation: revealContent 0.3s ease forwards;
        transition: filter 0.2s;

        &:hover, &.active {
            filter: brightness(1);
        }

        &:hover {
            cursor: pointer;
        }

        &.active {
            width: calc(1rem - 4px);
            height: calc(1rem - 4px);
            border: 2px solid rgb(255, 255, 255);
        }
    }
}
</style>
