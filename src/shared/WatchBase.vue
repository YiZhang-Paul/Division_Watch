<template>
    <div class="base-layer">
        <canvas id="base-canvas"></canvas>

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

export default class WatchBase extends Vue {

    public mounted(): void {
        this.renderOuterRings();
        this.renderCenterRings();
        this.renderInnerRings();
        this.renderCoreRings();
    }

    private renderOuterRings(): void {
        for (let i = 0; i < 8; ++i) {
            const canvas = document.getElementById(`outer-rings-${i}`) as HTMLCanvasElement;
            const context = canvas.getContext('2d') as CanvasRenderingContext2D;
            const { offsetWidth: width } = canvas;
            canvas.width = width;
            canvas.height = width;
            context.shadowColor = 'rgba(227, 94, 19, 0.95)';
            context.shadowBlur = 14;
            context.fillStyle = 'rgb(243, 245, 108)';
            context.beginPath();
            context.arc(width / 2, width / 2, width / 2 - 5, Math.PI * 1.233, Math.PI, true);
            context.lineTo(12, width / 2);
            context.arc(width / 2, width / 2, width / 2 - 12, Math.PI, Math.PI * 1.233);
            context.fill();
            context.closePath();
        }
    }

    private renderCenterRings(): void {
        for (let i = 0; i < 3; ++i) {
            const canvas = document.getElementById(`center-rings-${i}`) as HTMLCanvasElement;
            const context = canvas.getContext('2d') as CanvasRenderingContext2D;
            const { offsetWidth: width } = canvas;
            canvas.width = width;
            canvas.height = width;
            context.shadowColor = 'rgba(235, 249, 83, 0.9)';
            context.shadowOffsetY = 1;
            context.shadowBlur = 8;
            context.fillStyle = 'rgb(253, 244, 30)';
            context.beginPath();
            context.arc(width / 2, width / 2, width / 2 - 25, Math.PI * 1.6, Math.PI, true);
            context.lineTo(40, width / 2);
            context.arc(width / 2, width / 2, width / 2 - 40, Math.PI, Math.PI * 1.6);
            context.fill();
            context.closePath();
        }
    }

    private renderInnerRings(): void {
        for (let i = 0; i < 3; ++i) {
            const canvas = document.getElementById(`inner-rings-${i}`) as HTMLCanvasElement;
            const context = canvas.getContext('2d') as CanvasRenderingContext2D;
            const { offsetWidth: width } = canvas;
            canvas.width = width;
            canvas.height = width;
            context.fillStyle = 'rgba(119, 73, 31, 0.4)';
            context.beginPath();
            context.arc(width / 2, width / 2, width / 2 - 60, Math.PI * 1.6, Math.PI, true);
            context.lineTo(75, width / 2);
            context.arc(width / 2, width / 2, width / 2 - 75, Math.PI, Math.PI * 1.6);
            context.fill();
            context.closePath();
        }
    }

    private renderCoreRings(): void {
        for (let i = 0; i < 4; ++i) {
            const canvas = document.getElementById(`core-rings-${i}`) as HTMLCanvasElement;
            const context = canvas.getContext('2d') as CanvasRenderingContext2D;
            const { offsetWidth: width } = canvas;
            canvas.width = width;
            canvas.height = width;
            context.fillStyle = 'rgba(119, 73, 31, 0.4)';
            context.beginPath();
            context.arc(width / 2, width / 2, width / 2 - 83, Math.PI * 1.33, Math.PI, true);
            context.lineTo(85, width / 2);
            context.arc(width / 2, width / 2, width / 2 - 85, Math.PI, Math.PI * 1.33);
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

#base-canvas {
    $gap: calc(2% + 10px);

    margin: $gap;
    width: calc(100% - #{$gap} * 2);
    height: calc(100% - #{$gap} * 2);
    border-radius: 50%;
    background-color: rgb(45, 45, 45);
    box-shadow: 0 0 10px 0px rgba(227, 94, 19, 0.95);
}
</style>
