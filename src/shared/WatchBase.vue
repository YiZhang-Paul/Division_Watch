<template>
    <div class="base-layer">
        <canvas id="background-canvas"></canvas>

        <template v-for="setting in ringSettings">
            <canvas v-for="i in setting.total"
                :key="i"
                :id="setting.prefix + (i - 1)"
                :style="{ transform: 'rotate(' + 360 / setting.total * (i - 1) + 'deg)' }">
            </canvas>
        </template>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

import { RingOption } from '../core/data-model/ring-option';
import { ShadowOption } from '../core/data-model/shadow-option';
import { CanvasService } from '../core/services/canvas/canvas.service';

const canvasService = new CanvasService();

export default class WatchBase extends Vue {
    public readonly ringSettings = [
        { prefix: 'border-rings-', total: 8 },
        { prefix: 'outer-rings-', total: 3 },
        { prefix: 'center-rings-', total: 3 },
        { prefix: 'inner-rings-', total: 4 }
    ];

    public mounted(): void {
        this.renderWatchBase();
    }

    private renderWatchBase(): void {
        this.renderBorderRings();
        this.renderOuterRings();
        this.renderCenterRings();
        this.renderInnerRings();
    }

    private renderBorderRings(): void {
        const { prefix, total } = this.ringSettings[0];
        const ids = new Array(total).fill(0).map((_, i) => prefix + i);
        const ringOption = new RingOption('rgb(243, 245, 108)', 5, 7, 0.067);
        const shadowOption = new ShadowOption('rgba(227, 94, 19, 0.95)', 14);
        this.renderRings(ids, ringOption, shadowOption);
    }

    private renderOuterRings(): void {
        const { prefix, total } = this.ringSettings[1];
        const ids = new Array(total).fill(0).map((_, i) => prefix + i);
        const ringOption = new RingOption('rgb(253, 244, 30)', 25, 15, 0.095);
        const shadowOption = new ShadowOption('rgba(235, 249, 83, 0.9)', 8, 0, 1);
        this.renderRings(ids, ringOption, shadowOption);
    }

    private renderCenterRings(): void {
        const { prefix, total } = this.ringSettings[2];
        const ids = new Array(total).fill(0).map((_, i) => prefix + i);
        this.renderRings(ids, new RingOption('rgba(119, 73, 31, 0.4)', 60, 15, 0.095));
    }

    private renderInnerRings(): void {
        const { prefix, total } = this.ringSettings[3];
        const ids = new Array(total).fill(0).map((_, i) => prefix + i);
        this.renderRings(ids, new RingOption('rgba(119, 73, 31, 0.4)', 83, 2, 0.3));
    }

    private renderRings(ids: string[], ringOption: RingOption, shadowOption: ShadowOption | null = null): void {
        for (const id of ids) {
            const context = canvasService.getRenderingContext2D(id);
            const { fill, margin, thickness, gap } = ringOption;
            const radius = context.canvas.offsetWidth / 2;
            const angle = Math.PI + Math.PI * 2 / ids.length * (1 - gap);
            canvasService.setShadowOptions(context, shadowOption);
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
