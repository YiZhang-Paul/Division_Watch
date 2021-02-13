<template>
    <div :id="id" class="placeholder-panel-container">
        <svg class="texture" v-for="n in 4" :key="n" viewBox="0 0 50 50">
            <path d="M4 2 L46 2 L25.15 23Z" />
            <path d="M2 4 L2 46 L23 25.15Z" />
        </svg>

        <span>{{ text }}</span>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';
import VanillaTilt from 'vanilla-tilt';
import * as uuid from 'uuid';

class PlaceholderPanelProp {
    public text = prop<string>({ default: '' });
}

export default class PlaceholderPanel extends Vue.with(PlaceholderPanelProp) {
    public readonly id = `placeholder-panel-container-${uuid.v4()}`;

    public mounted(): void {
        const container = document.querySelector(`#${this.id}`);
        VanillaTilt.init(container as HTMLElement, { max: 0, glare: true, 'max-glare': 0.1 });
    }
}
</script>

<style lang="scss" scoped>
.placeholder-panel-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 1.25rem 0;
    border: 1px solid rgba(235, 235, 235, 0.15);
    background: radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(186, 186, 186, 0.1) 100%);
    color: rgb(235, 235, 235);
    opacity: 0;
    animation: revealContent 0.3s ease 0.2s forwards;

    .texture {
        position: absolute;
        height: 50%;
        fill: none;
        stroke: rgba(195, 195, 195, 0.15);

        &:nth-child(1) {
            top: 0;
            left: 0;
        }

        &:nth-child(2) {
            top: 0;
            right: 0;
            transform: rotateY(180deg);
        }

        &:nth-child(3) {
            right: 0;
            bottom: 0;
            transform: rotate(180deg);
        }

        &:nth-child(4) {
            left: 0;
            bottom: 0;
            transform: rotateX(180deg);
        }
    }

    span {
        font-size: 0.5rem;
        opacity: 0;
        animation: revealContent 0.5s ease 0.2s forwards
    }
}
</style>
