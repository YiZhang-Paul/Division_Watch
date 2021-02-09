<template>
    <div :id="id" class="view-panel-container" :class="{ 'expanded-panel': isExpanded }">
        <div class="panel-box-wrapper">
            <div class="panel-box" v-for="n in 4" :key="n"></div>
        </div>

        <template v-if="isExpanded">
            <div class="header">
                <slot name="header"></slot>
            </div>

            <div class="content">
                <slot></slot>
            </div>

            <div class="footer">
                <slot name="footer"></slot>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';
import VanillaTilt from 'vanilla-tilt';
import * as uuid from 'uuid';

class ViewPanelProp {
    public maxTilt = prop<number>({ default: 0.3 });
}

export default class ViewPanel extends Vue.with(ViewPanelProp) {
    public readonly id = `view-panel-container-${uuid.v4()}`;
    private stage = 1;

    get isExpanded(): boolean {
        return this.stage >= 11;
    }

    public mounted(): void {
        const container = document.querySelector(`#${this.id}`);
        container?.addEventListener('animationend', () => this.stage++);
        VanillaTilt.init(container as HTMLElement, { max: this.maxTilt, glare: true, 'max-glare': 0.1 });
    }
}
</script>

<style lang="scss" scoped>
.view-panel-container {
    $max-content-width: 95%;
    $box-expanded-height: 82.5%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    border: 1px solid transparent;
    background-color: transparent;
    box-shadow: 3px 3px 3px 0 transparent;
    transition: border-color 0.15s, background-color 0.15s, box-shadow 0.15s;
    transition-delay: 0.15s;

    &.expanded-panel {
        border-color: rgba(170, 170, 170, 0.4);
        background-color: rgba(160, 160, 160, 0.25);
        box-shadow: 3px 3px 3px 0 rgba(120, 120, 120, 0.25);
    }

    .header, .content, .footer {
        width: $max-content-width;
        max-width: $max-content-width;
        opacity: 0;
        animation: revealContent 0.4s ease 0.5s forwards;
    }

    .header, .footer {
        height: calc((100% - #{$box-expanded-height}) / 2.75);
        max-height: calc((100% - #{$box-expanded-height}) / 2.75);
    }

    .header {
        margin-bottom: calc((100% - #{$box-expanded-height}) / 20);
    }

    .content {
        margin-top: calc(#{$box-expanded-height} * 0.025);
        margin-bottom: calc(#{$box-expanded-height} * 0.025);
        height: calc(#{$box-expanded-height} * 0.95);
        max-height: calc(#{$box-expanded-height} * 0.95);
    }

    .footer {
        margin-top: calc((100% - #{$box-expanded-height}) / 20);
    }

    .panel-box-wrapper {
        $box-width: 0.75vw;
        $box-height: 0.5vh;
        $blink-duration: 0.25s;

        position: absolute;
        width: $box-width;
        height: $box-height;
        border-top: 1px solid rgba(200, 200, 200, 0.6);
        border-bottom: 1px solid rgba(200, 200, 200, 0.6);
        background-color: transparent;
        animation: blinkFast $blink-duration ease-in forwards,
                   expandPanelBox 1s ease 0.5s forwards;

        .panel-box {
            $box-move-duration: 0.2s;
            $box-move-delay: calc(#{$blink-duration} + 0.2s);

            position: absolute;
            width: $box-width;
            height: $box-height;
            background-color: rgb(200, 200, 200);

            &:nth-child(1) {
                top: 0;
                left: 0;
                animation: movePanelBoxDown $box-move-duration ease $box-move-delay forwards,
                           movePanelBoxLeft $box-move-duration ease $box-move-delay forwards;
            }

            &:nth-child(2) {
                top: 0;
                right: 0;
                animation: movePanelBoxDown $box-move-duration ease $box-move-delay forwards,
                           movePanelBoxRight $box-move-duration ease $box-move-delay forwards;
            }

            &:nth-child(3) {
                bottom: 0;
                left: 0;
                animation: movePanelBoxUp $box-move-duration ease $box-move-delay forwards,
                           movePanelBoxLeft $box-move-duration ease $box-move-delay forwards;
            }

            &:nth-child(4) {
                bottom: 0;
                right: 0;
                animation: movePanelBoxUp $box-move-duration ease $box-move-delay forwards,
                           movePanelBoxRight $box-move-duration ease $box-move-delay forwards;
            }
        }

        @keyframes expandPanelBox {
            0% {
                width: $box-width;
                height: $box-height;
            }
            20% {
                width: 25%;
                height: 1.5vh;
            }
            40% {
                width: 75%;
                height: 1.5vh;
            }
            65% {
                width: 75%;
                height: 1.5vh;
            }
            100% {
                width: calc(95% - 5px);
                height: $box-expanded-height;
            }
        }

        @keyframes movePanelBoxDown {
            from { top: 0; }
            to { top: 5px; }
        }

        @keyframes movePanelBoxUp {
            from { bottom: 0; }
            to { bottom: 5px; }
        }

        @keyframes movePanelBoxLeft {
            from { left: 0; }
            to { left: calc(#{$box-width} / 3 * -2); }
        }

        @keyframes movePanelBoxRight {
            from { right: 0; }
            to { right: calc(#{$box-width} / 3 * -2); }
        }
    }
}
</style>
