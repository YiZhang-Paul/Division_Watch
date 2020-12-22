<template>
    <div class="base-layer">
        <canvas id="background-canvas"></canvas>

        <canvas v-for="i in 8"
            :key="i"
            :id="'outer-rings-' + (i - 1)"
            :style="{ transform: 'rotate(' + 45 * (i - 1) + 'deg)' }">
        </canvas>

        <canvas v-for="i in 3"
            :key="i"
            :id="'center-rings-' + (i - 1)"
            :style="{ transform: 'rotate(' + 120 * (i - 1) + 'deg)' }">
        </canvas>

        <canvas v-for="i in 3"
            :key="i"
            :id="'inner-rings-' + (i - 1)"
            :style="{ transform: 'rotate(' + 120 * (i - 1) + 'deg)' }">
        </canvas>

        <canvas v-for="i in 4"
            :key="i"
            :id="'core-rings-' + (i - 1)"
            :style="{ transform: 'rotate(' + 90 * (i - 1) + 'deg)' }">
        </canvas>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

import { RingOption } from '../core/data-model/ring-option';
import { ShadowOption } from '../core/data-model/shadow-option';

export default class WatchBase extends Vue {

    public mounted(): void {
        this.renderOuterRings();
        this.renderCenterRings();
        this.renderInnerRings();
        this.renderCoreRings();
    }

    private renderOuterRings(): void {
        const ids = new Array(8).fill(0).map((_, i) => `outer-rings-${i}`);
        const ringOption = new RingOption('rgb(243, 245, 108)', 5, 7, 0.067);
        const shadowOption = new ShadowOption('rgba(227, 94, 19, 0.95)', 14);
        this.renderRings(ids, ringOption, shadowOption);
    }

    private renderCenterRings(): void {
        const ids = new Array(3).fill(0).map((_, i) => `center-rings-${i}`);
        const ringOption = new RingOption('rgb(253, 244, 30)', 25, 15, 0.095);
        const shadowOption = new ShadowOption('rgba(235, 249, 83, 0.9)', 8, 0, 1);
        this.renderRings(ids, ringOption, shadowOption);
    }

    private renderInnerRings(): void {
        const ids = new Array(3).fill(0).map((_, i) => `inner-rings-${i}`);
        this.renderRings(ids, new RingOption('rgba(119, 73, 31, 0.4)', 60, 15, 0.095));
    }

    private renderCoreRings(): void {
        const ids = new Array(4).fill(0).map((_, i) => `core-rings-${i}`);
        this.renderRings(ids, new RingOption('rgba(119, 73, 31, 0.4)', 83, 2, 0.3));
    }

    private renderRings(ids: string[], ringOption: RingOption, shadowOption: ShadowOption | null = null): void {
        for (const id of ids) {
            const canvas = document.getElementById(id) as HTMLCanvasElement;
            const context = canvas.getContext('2d') as CanvasRenderingContext2D;
            const { offsetWidth: width } = canvas;
            const { fill, margin, thickness, gap } = ringOption;
            const angle = Math.PI + Math.PI * 2 / ids.length * (1 - gap);
            const radius = width / 2;
            canvas.width = width;
            canvas.height = width;
            context.shadowColor = shadowOption?.color ?? context.shadowColor;
            context.shadowOffsetX = shadowOption?.offsetX ?? context.shadowOffsetX;
            context.shadowOffsetY = shadowOption?.offsetY ?? context.shadowOffsetY;
            context.shadowBlur = shadowOption?.blur ?? context.shadowBlur;
            context.fillStyle = fill;
            context.beginPath();
            context.arc(radius, radius, radius - margin, angle, Math.PI, true);
            context.lineTo(margin + thickness, radius);
            context.arc(radius, radius, radius - margin - thickness, Math.PI, angle);
            context.fill();
            context.closePath();
        }
    }
}
</script>

<style lang="scss" scoped>
.base-layer {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transform: rotate(2.5deg);
}

canvas {
    $gap: 2%;

    position: absolute;
    top: 0;
    left: 0;
    margin: $gap;
    width: calc(100% - #{$gap} * 2);
    height: calc(100% - #{$gap} * 2);
}

#background-canvas {
    $gap: calc(2% + 10px);

    margin: $gap;
    width: calc(100% - #{$gap} * 2);
    height: calc(100% - #{$gap} * 2);
    border-radius: 50%;
    background-color: rgb(45, 45, 45);
    box-shadow: 0 0 10px 0px rgba(227, 94, 19, 0.95);
}
</style>
