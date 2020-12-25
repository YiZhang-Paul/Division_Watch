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
import { AnimationService } from '../core/services/animation/animation.service';
import { CanvasService } from '../core/services/canvas/canvas.service';

const animationService = new AnimationService();
const canvasService = new CanvasService();

export default class WatchBase extends Vue {
    public readonly backgroundCanvasId = 'background-canvas';
    public readonly ringsCanvasId = 'rings-canvas';
    public backgroundCanvasStyle = { 'background-color': '', 'box-shadow': '' };
    private colorOption = store.getters['watchBase/colorOption'];
    private angleAnimation = store.getters['watchBase/angleAnimation'];
    private blurAnimation = store.getters['watchBase/blurAnimation'];
    private startTime = Date.now();
    private lastRender = 0;

    public mounted(): void {
        this.renderWatchBase();
    }

    private renderWatchBase(): void {
        const now = Date.now();

        if (now - this.lastRender > 1000 / 45) {
            const elapsed = Date.now() - this.startTime;
            const backgroundBlur = animationService.getBlur(this.blurAnimation.background, elapsed);
            const { background, borderRingShadow } = this.colorOption;
            this.backgroundCanvasStyle['background-color'] = background;
            this.backgroundCanvasStyle['box-shadow'] = `0 0 ${backgroundBlur}px 0px ${borderRingShadow}`;
            this.renderRings();
            this.renderScales();
            this.lastRender = now;
        }

        requestAnimationFrame(this.renderWatchBase.bind(this));
    }

    private renderRings(): void {
        const elapsed = Date.now() - this.startTime;
        const borderRingOption = new RingOption(this.colorOption.borderRing, 0.04, 0.054, 0.067);
        const borderRingBlur = animationService.getBlur(this.blurAnimation.borderRing, elapsed);
        const borderShadowOption = new ShadowOption(this.colorOption.borderRingShadow, borderRingBlur);
        const outerRingOption = new RingOption(this.colorOption.outerRing, 0.205, 0.093, 0.095);
        const outerRingBlur = animationService.getBlur(this.blurAnimation.outerRing, elapsed);
        const outerShadowOption = new ShadowOption(this.colorOption.outerRingShadow, outerRingBlur, 0, 1);
        const innerThickRingOption = new RingOption(this.colorOption.innerRing, 0.476, 0.11, 0.095);
        const innerThinRingOption = new RingOption(this.colorOption.innerRing, 0.63, 0.016, 0.3);
        const borderRingAngle = animationService.getAngle(this.angleAnimation.borderRing, elapsed) + 1.5;
        const outerRingAngle = animationService.getAngle(this.angleAnimation.outerRing, elapsed);
        const innerRingAngle = animationService.getAngle(this.angleAnimation.innerRing, elapsed);
        const context = canvasService.getRenderingContext2D(this.ringsCanvasId);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        this.renderRing(context, 8, borderRingOption, borderShadowOption, borderRingAngle);
        this.renderRing(context, 3, outerRingOption, outerShadowOption, outerRingAngle);
        this.renderRing(context, 3, innerThickRingOption, null, innerRingAngle);
        this.renderRing(context, 4, innerThinRingOption, null, innerRingAngle);
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
        const elapsed = Date.now() - this.startTime;
        const scaleRotate = animationService.getAngle(this.angleAnimation.scale, elapsed);
        const guardRotate = animationService.getAngle(this.angleAnimation.scaleGuard, elapsed);
        context.strokeStyle = this.colorOption.scaleGuard;
        context.lineWidth = 1.5;
        context.beginPath();
        context.arc(radius, radius, radius * 0.9, 0, Math.PI * 2);
        context.stroke();

        for (let i = 0; i < 3; ++i) {
            canvasService.rotate(context, radius, radius, 120 * i + guardRotate);

            context.strokeStyle = this.colorOption.scale;
            context.lineWidth = 1.5;
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

            context.lineWidth = 2;
            context.beginPath();
            context.arc(radius, radius, radius * 0.9, Math.PI, Math.PI * 1.603);
            context.stroke();

            canvasService.rotate(context, radius, radius, -120 * i - guardRotate);
        }

        canvasService.rotate(context, radius, radius, scaleRotate);

        for (let i = 0; i < 120; ++i) {
            const isSeparator = i % 10 === 0;
            context.strokeStyle = this.colorOption.scale;
            context.lineWidth = isSeparator ? 2 : 1.5;
            context.beginPath();
            context.moveTo(radius * (isSeparator ? 0.033 : 0.038), radius);
            context.lineTo(radius * (isSeparator ? 0.075 : 0.062), radius);
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
