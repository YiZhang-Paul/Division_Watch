<template>
    <div :id="containerId" class="view-panel-container">
        <div class="panel-box-wrapper">
            <div class="panel-box" v-for="n in 4" :key="n"></div>
        </div>

        <div :id="contentId" class="content-container" :class="contentContainerClasses">
            <template v-if="showContent">
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
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';
import VanillaTilt from 'vanilla-tilt';
import * as uuid from 'uuid';

import store from '../../store';
import { soundKey } from '../../store/sound/sound.state';
import { SoundOption } from '../../core/data-model/generic/sound-option';
import { SoundType } from '../../core/enums/sound-type.enum';

class ViewPanelProp {
    public maxTilt = prop<number>({ default: 0.3 });
}

export default class ViewPanel extends Vue.with(ViewPanelProp) {
    public readonly sound = new SoundOption('panel_open', SoundType.UI);
    public readonly containerId = `view-panel-container-${uuid.v4()}`;
    public readonly contentId = `content-container-${uuid.v4()}`;
    private stage = 1;

    get showContent(): boolean {
        return this.stage >= 6;
    }

    get contentContainerClasses(): { [key: string]: boolean } {
        return { 'glass-panel-light': this.showContent, 'unexpanded-panel': !this.showContent };
    }

    public mounted(): void {
        const container = document.querySelector(`#${this.containerId}`);
        const content = document.querySelector(`#${this.contentId}`);
        container?.addEventListener('animationend', () => this.stage++);
        VanillaTilt.init(container as HTMLElement, { max: this.maxTilt });
        VanillaTilt.init(content as HTMLElement, { max: 0, glare: true, 'max-glare': 0.1 });
        setTimeout(() => store.dispatch(`${soundKey}/playSound`, this.sound), 500);
    }

    public beforeUnmount(): void {
        store.dispatch(`${soundKey}/stopSound`, this.sound);
    }
}
</script>

<style lang="scss" scoped>
.view-panel-container {
    $max-content-width: 95%;
    $box-expanded-height: 76%;
    $header-footer-height: calc((100% - #{$box-expanded-height}) / 2.75);

    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .content-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        width: 100%;
        height: calc(#{$box-expanded-height} + 7%);
        transition: border 0.15s, background-color 0.15s, box-shadow 0.15s;
        transition-delay: 0.15s;

        &.unexpanded-panel {
            border: 1px solid transparent;
            background-color: transparent;
            box-shadow: 3px 3px 3px 0 transparent;
        }
    }

    .header, .content, .footer {
        opacity: 0;
        animation: revealContent 0.1s ease forwards;
    }

    .header, .footer {
        position: absolute;
        width: 100% ;
        max-width: 100%;
        height: $header-footer-height;
        max-height: $header-footer-height;
    }

    .header {
        top: calc(#{$header-footer-height} * -1 - 1.75%);
    }

    .content {
        width: $max-content-width;
        max-width: $max-content-width;
        height: 90%;
        max-height: 90%;
    }

    .footer {
        bottom: calc(#{$header-footer-height} * -1 - 0.75%);
    }

    .panel-box-wrapper {
        $box-width: 0.75vw;
        $box-height: 0.275vh;
        $expand-duration: 0.5s;
        $expand-delay: 0.25s;

        position: absolute;
        width: $box-width;
        height: $box-height;
        border-top: 1px solid rgba(200, 200, 200, 0.6);
        border-bottom: 1px solid rgba(200, 200, 200, 0.6);
        background-color: transparent;
        animation: blinkFast $expand-delay ease forwards,
                   expandPanelBoxStage1 calc(#{$expand-duration} * 0.4) ease $expand-delay forwards,
                   expandPanelBoxStage2 calc(#{$expand-duration} * 0.6) ease calc(#{$expand-duration} * 0.4 + #{$expand-delay}) forwards;

        .panel-box {
            $box-move-duration: 0.2s;
            $box-move-delay: calc(#{$expand-duration} * 0.75 + #{$expand-delay});

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

        @keyframes expandPanelBoxStage1 {
            0% {
                width: $box-width;
                height: $box-height;
            }
            100% {
                width: 75%;
                height: $box-height;
            }
        }

        @keyframes expandPanelBoxStage2 {
            0% {
                width: 75%;
                height: $box-height;
            }
            100% {
                width: calc(95% - 20px);
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
