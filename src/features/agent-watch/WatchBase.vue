<template>
    <div class="watch-base-container">
        <canvas :id="backgroundCanvasId" :style="backgroundCanvasStyle"></canvas>
        <canvas :id="ringsCanvasId"></canvas>

        <template v-if="isBooting">
            <div class="booting-outer-core"></div>
            <div class="booting-inner-core-1"></div>
            <div class="booting-inner-core-2"></div>
        </template>
    </div>
</template>

<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';

import store from '../../store';
// eslint-disable-next-line no-unused-vars
import { IWatchColorOption, IAngleAnimation, IBlurAnimation, watchBaseKey } from '../../store/watch-base/watch-base.state';
import { WatchState } from '../../core/enums/watch-state.enum';
import { RingOption } from '../../core/data-model/watch-option/ring-option';
import { ShadowOption } from '../../core/data-model/watch-option/shadow-option';
import { AnimationService } from '../../core/services/animation/animation.service';
import { CanvasService } from '../../core/services/canvas/canvas.service';

const animationService = new AnimationService();
const canvasService = new CanvasService();

class WatchBaseProp {
    public state = prop<WatchState>({ default: WatchState.AgentBooting });
}

@Options({
    emits: ['state:booted']
})
export default class WatchBase extends Vue.with(WatchBaseProp) {
    public readonly backgroundCanvasId = `background-canvas-${Date.now()}`;
    public readonly ringsCanvasId = `rings-canvas-${Date.now()}`;
    public backgroundCanvasStyle = { 'background-color': '', 'box-shadow': '' };
    private canAnimate = false;
    private lastRender = 0;
    private startTime = 0;

    get isBooting(): boolean {
        return this.state === WatchState.AgentBooting;
    }

    get colorOption(): IWatchColorOption {
        return store.getters[`${watchBaseKey}/colorOption`];
    }

    get angleAnimation(): IAngleAnimation {
        return store.getters[`${watchBaseKey}/angleAnimation`];
    }

    get blurAnimation(): IBlurAnimation {
        return store.getters[`${watchBaseKey}/blurAnimation`];
    }

    public mounted(): void {
        this.renderWatchBase();
        setTimeout(() => this.canAnimate = true, 2700);
        setTimeout(() => this.$emit('state:booted'), 3200);
    }

    private renderWatchBase(): void {
        const now = Date.now();

        if (this.canAnimate) {
            this.startTime = this.startTime || now;
        }

        if (!this.canAnimate || now - this.lastRender > 1000 / 45) {
            const elapsed = this.canAnimate ? now - this.startTime : 0;
            const backgroundBlur = this.canAnimate ? animationService.getBlur(this.blurAnimation.background, elapsed) : 0;
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
        const borderRingBlur = this.canAnimate ? animationService.getBlur(this.blurAnimation.borderRing, elapsed) : 0;
        const borderShadowOption = new ShadowOption(this.colorOption.borderRingShadow, borderRingBlur);
        const outerRingOption = new RingOption(this.colorOption.outerRing, 0.205, 0.093, 0.095);
        const outerRingBlur = this.canAnimate ? animationService.getBlur(this.blurAnimation.outerRing, elapsed) : 0;
        const outerShadowOption = new ShadowOption(this.colorOption.outerRingShadow, outerRingBlur, 0, 1);
        const innerThickRingOption = new RingOption(this.colorOption.innerRing, 0.476, 0.11, 0.095);
        const innerThinRingOption = new RingOption(this.colorOption.innerRing, 0.63, 0.016, 0.3);
        const borderRingAngle = this.canAnimate ? animationService.getAngle(this.angleAnimation.borderRing, elapsed) + 1.5 : 1.5;
        const outerRingAngle = this.canAnimate ? animationService.getAngle(this.angleAnimation.outerRing, elapsed) : 0;
        const innerRingAngle = this.canAnimate ? animationService.getAngle(this.angleAnimation.innerRing, elapsed) : 0;
        const context = canvasService.getRenderingContext2D(this.ringsCanvasId);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        this.renderRing(context, 8, borderRingOption, borderShadowOption, borderRingAngle);
        this.renderRing(context, 3, outerRingOption, outerShadowOption, outerRingAngle);

        if (!this.isBooting) {
            this.renderRing(context, 3, innerThickRingOption, null, innerRingAngle);
            this.renderRing(context, 4, innerThinRingOption, null, innerRingAngle);
        }
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
        const scaleRotate = this.canAnimate ? animationService.getAngle(this.angleAnimation.scale, elapsed) : 0;
        const guardRotate = this.canAnimate ? animationService.getAngle(this.angleAnimation.scaleGuard, elapsed) : 0;
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
            context.strokeStyle = isSeparator ? this.colorOption.scaleSeparator : this.colorOption.scale;
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
.watch-base-container {
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

    & > canvas:first-of-type {
        $gap: 5.5%;

        margin: $gap;
        width: calc(100% - #{$gap} * 2);
        height: calc(100% - #{$gap} * 2);
        border-radius: 50%;
    }

    .booting-outer-core,
    .booting-inner-core-1,
    .booting-inner-core-2 {
        position: absolute;
        opacity: 0;
        border-radius: 50%;
        box-shadow: 0 0 2px 2px rgba(241, 235, 78, 0.25),
                    0 0 8px 12px rgba(243, 245, 108, 0.85);
    }

    .booting-outer-core {
        $dimension: 50%;

        top: calc(50% - #{$dimension} / 2);
        left: calc(50% - #{$dimension} / 2);
        width: $dimension;
        height: $dimension;
        animation: loadOuterCore 0.9s linear 2.5s forwards;
        filter: blur(8px);
        background-color: rgba(236, 232, 132, 0.8);
    }

    .booting-inner-core-1 {
        $dimension: 40%;

        top: calc(50% - #{$dimension} / 2);
        left: calc(50% - #{$dimension} / 2);
        width: $dimension;
        height: $dimension;
        animation: loadInnerCore2 1.8s ease 1.5s forwards;
        filter: blur(4px);
        background-color: rgba(235, 232, 142, 0.95);
    }

    .booting-inner-core-2 {
        $dimension: 27%;

        top: calc(50% - #{$dimension} / 2);
        left: calc(50% - #{$dimension} / 2);
        width: $dimension;
        height: $dimension;
        animation: blinkSlow 3s linear 0.25s forwards;
        filter: blur(6px);
        background-color: rgba(253, 255, 132, 0.95);
    }

    @keyframes loadInnerCore2 {
        0% {
            top: 42.5%;
            left: 42.5%;
            width: 15%;
            height: 15%;
            opacity: 0;
        }
        30% {
            opacity: 0.75;
        }
        100% {
            top: 30%;
            left: 30%;
            width: 40%;
            height: 40%;
            opacity: 0.75;
        }
    }

    @keyframes loadOuterCore {
        0% {
            top: 30%;
            left: 30%;
            width: 40%;
            height: 40%;
            opacity: 0.2;
        }
        25% {
            opacity: 0.8;
        }
        100% {
            top: 25%;
            left: 25%;
            width: 50%;
            height: 50%;
            opacity: 1;
        }
    }
}
</style>
