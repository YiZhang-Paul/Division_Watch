<template>
    <div class="section-panel-container">
        <div class="side-guards">
            <div v-for="n in 3" :key="n"></div>
        </div>

        <span class="name">{{ name }}</span>

        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

class SectionPanelProp {
    public name = prop<string>({ default: '' });
}

export default class SectionPanel extends Vue.with(SectionPanelProp) { }
</script>

<style lang="scss" scoped>
.section-panel-container {
    $content-width: 85%;
    $margin-left: calc((100% - #{$content-width}) / 2);

    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    color: rgb(255, 255, 255);
    font-family: 'Jost';

    .name {
        align-self: flex-start;
        margin-left: $margin-left;
        opacity: 0;
        animation: revealContent 0.3s ease 1s forwards;
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: $content-width;
        opacity: 0;
        animation: revealContent 0.2s ease 1.2s forwards;
    }

    .side-guards {
        $top: 0.75rem;
        $gap: 1.75%;
        $horizontal-guard-height: 2px;
        $vertical-guard-start-height: calc((100% - #{$gap}) / 3);
        $blink-duration: 0.3s;
        $blink-repeat: 2;

        position: absolute;
        top: $top;
        left: 0;
        width: $margin-left;
        height: calc(97.5% - #{$top});

        & > div {
            position: absolute;
            left: calc(55% + #{$gap} * 2);
            background-color: rgba(225, 225, 225, 0.8);
            opacity: 0;
        }

        & > div:nth-child(1) {
            top: calc((100% - #{$horizontal-guard-height}) / 2);
            width: 32.5%;
            height: $horizontal-guard-height;
            opacity: 1;
            animation: blinkFast $blink-duration ease forwards $blink-repeat,
                       moveGuard1 0.35s ease calc(#{$blink-duration} * #{$blink-repeat}) forwards;
        }

        & > div:nth-child(2) {
            top: calc(#{$gap} / 2 + #{$vertical-guard-start-height});
            left: calc(55% - #{$gap});
            width: 1px;
            height: $vertical-guard-start-height;
            background-color: rgba(225, 225, 225, 0.5);
            animation: revealContent 0.2s ease calc(#{$blink-duration} * #{$blink-repeat} + 0.25s) forwards,
                       expandGuard2 0.15s ease calc(#{$blink-duration} * #{$blink-repeat} + 0.2s) forwards;
        }

        & > div:nth-child(3) {
            top: calc((100% - #{$horizontal-guard-height}) / 2);
            width: 17.5%;
            height: $horizontal-guard-height;
            animation: revealContent 0.01s ease calc(#{$blink-duration} * #{$blink-repeat}) forwards,
                       moveGuard3 0.35s ease calc(#{$blink-duration} * #{$blink-repeat}) forwards;
        }

        @keyframes moveGuard1 {
            from { top: calc((100% - #{$horizontal-guard-height}) / 2) }
            to { top: 0 }
        }

        @keyframes expandGuard2 {
            from {
                top: calc((100% - #{$horizontal-guard-height}) / 2);
                height: $vertical-guard-start-height;
            }
            to {
                top: calc(#{$gap} / 2);
                height: calc(100% - #{$gap});
            }
        }

        @keyframes moveGuard3 {
            from { top: calc((100% - #{$horizontal-guard-height}) / 2) }
            to { top: calc(100% - #{$horizontal-guard-height}) }
        }
    }
}
</style>
