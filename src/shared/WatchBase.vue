<template>
    <div class="base-layer">
        <canvas :id="backgroundCanvasId" :style="backgroundCanvasStyle"></canvas>
        <canvas :id="ringsCanvasId"></canvas>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

import store from '../store';
import { RingOption } from '../core/data-model/ring-option';
import { ShadowOption } from '../core/data-model/shadow-option';
import { CanvasService } from '../core/services/canvas/canvas.service';

const canvasService = new CanvasService();

export default class WatchBase extends Vue {
    public readonly backgroundCanvasId = 'background-canvas';
    public readonly ringsCanvasId = 'rings-canvas';
    private colorOption = store.getters['watchBase/color'];
    private lastRender = 0;

    get backgroundCanvasStyle(): { [key: string]: string } {
        return {
            'background-color': this.colorOption.background,
            'box-shadow': `0 0 10px 0px ${this.colorOption.borderRingShadow}`
        };
    }

    public mounted(): void {
        this.renderWatchBase();
    }

    private renderWatchBase(): void {
        const now = Date.now();

        if (now - this.lastRender > 1000 * 2) {
            this.renderRings();
            this.renderScales();
            this.lastRender = now;
        }

        requestAnimationFrame(this.renderWatchBase.bind(this));
    }

    private renderRings(): void {
        const borderRingOption = new RingOption(this.colorOption.borderRing, 0.04, 0.054, 0.067);
        const borderShadowOption = new ShadowOption(this.colorOption.borderRingShadow, 14);
        const outerRingOption = new RingOption(this.colorOption.outerRing, 0.19, 0.095, 0.095);
        const outerShadowOption = new ShadowOption(this.colorOption.outerRingShadow, 8, 0, 1);
        const context = canvasService.getRenderingContext2D(this.ringsCanvasId);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        this.renderRing(context, 8, borderRingOption, borderShadowOption, 1.5);
        this.renderRing(context, 3, outerRingOption, outerShadowOption);
        this.renderRing(context, 3, new RingOption(this.colorOption.innerRing, 0.476, 0.11, 0.095));
        this.renderRing(context, 4, new RingOption(this.colorOption.innerRing, 0.63, 0.016, 0.3));
    }

    private renderRing(
        context: CanvasRenderingContext2D,
        total: number,
        ringOption: RingOption,
        shadowOption: ShadowOption | null = null,
        rotate = 0
    ): void {
        const { fill, margin, thickness, gap } = ringOption;
        const angle = Math.PI + Math.PI * 2 / total * (1 - gap);
        const radius = context.canvas.offsetWidth / 2;
        canvasService.setShadowOptions(context, shadowOption);
        context.fillStyle = fill;

        for (let i = 0; i < total; ++i) {
            canvasService.rotate(context, radius, radius, 360 / total * i + rotate);
            context.beginPath();
            context.arc(radius, radius, radius * (1 - margin), angle, Math.PI, true);
            context.lineTo(radius * (margin + thickness), radius);
            context.arc(radius, radius, radius * (1 - margin - thickness), Math.PI, angle);
            context.fill();
            canvasService.rotate(context, radius, radius, -360 / total * i - rotate);
        }
    }

    private renderScales(): void {
        const context = canvasService.getRenderingContext2D(this.backgroundCanvasId);
        const radius = context.canvas.offsetWidth / 2;
        context.strokeStyle = this.colorOption.scaleGuard;
        context.lineWidth = 1.5;
        context.beginPath();
        context.arc(radius, radius, radius * 0.9, 0, Math.PI * 2);
        context.stroke();

        for (let i = 0; i < 3; ++i) {
            canvasService.rotate(context, radius, radius, 120 * i);

            context.strokeStyle = this.colorOption.scale;
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(radius * 0.082, radius);
            context.lineTo(radius * 0.1, radius);
            context.stroke();

            context.beginPath();
            canvasService.rotate(context, radius, radius, 108.5);
            context.moveTo(radius * 0.082, radius);
            context.lineTo(radius * 0.1, radius);
            canvasService.rotate(context, radius, radius, -108.5);
            context.stroke();

            context.lineWidth = 2.5;
            context.beginPath();
            context.arc(radius, radius, radius * 0.9, Math.PI, Math.PI * 1.603);
            context.stroke();

            canvasService.rotate(context, radius, radius, -120 * i);
        }

        for (let i = 0; i < 120; ++i) {
            const isSeparator = i % 10 === 0;
            context.strokeStyle = this.colorOption.scale;
            context.lineWidth = isSeparator ? 3 : 1.5;
            context.beginPath();
            context.moveTo(radius * (isSeparator ? 0.033 : 0.038), radius);
            context.lineTo(radius * (isSeparator ? 0.075 : 0.068), radius);
            canvasService.rotate(context, radius, radius, 3);
            context.stroke();
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
        $gap: 5.5%;

        margin: $gap;
        width: calc(100% - #{$gap} * 2);
        height: calc(100% - #{$gap} * 2);
        border-radius: 50%;
    }
}
</style>
