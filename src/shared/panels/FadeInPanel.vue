<template>
    <div class="fade-in-panel-container">
        <div class="content">
            <slot></slot>
        </div>

        <canvas :id="id" v-if="intensity <= intensityCap"></canvas>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import * as uuid from 'uuid';

export default class FadeInPanel extends Vue {
    public readonly id = `fade-in-panel-pixels-${uuid.v4()}`;
    public readonly intensityCap = 1.6;
    public intensity = 0;
    private readonly slices = 10;

    public mounted(): void {
        const canvas = document.querySelector(`#${this.id}`) as HTMLCanvasElement;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        this.renderPixels();
    }

    private renderPixels(): void {
        if (this.intensity >= this.intensityCap) {
            return;
        }

        const canvas = document.querySelector(`#${this.id}`) as HTMLCanvasElement;

        if (!canvas) {
            return;
        }

        const [width, height] = [canvas.width / this.slices, canvas.height / this.slices];
        const context = canvas.getContext('2d');

        if (!context) {
            return;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'rgba(35, 35, 35, 0.98)';
        context.beginPath();

        for (let i = 0; i < this.slices; ++i) {
            for (let j = 0; j < this.slices; ++j) {
                if (Math.random() < this.intensity && context) {
                    context.rect(width * i, height * j, width, height);
                }
            }
        }

        context.fill();
        context.closePath();
        this.intensity += 0.04;
        setTimeout(() => requestAnimationFrame(this.renderPixels.bind(this)), 16.67);
    }
}
</script>

<style lang="scss" scoped>
.fade-in-panel-container {
    position: relative;
    width: 100%;
    height: 100%;

    .content, canvas {
        width: 100%;
        height: 100%;
    }

    .content {
        box-sizing: border-box;
    }

    canvas {
        position: absolute;
        top: 0;
        left: 0;
    }
}
</style>
