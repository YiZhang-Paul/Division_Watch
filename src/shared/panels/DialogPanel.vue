<template>
    <div :id="id" class="dialog-panel-container glass-panel-light">
        <div class="header">
            <span>BEWARE:</span>
            <alert-outline class="icon" />
        </div>

        <div class="separator">
            <div></div>
            <div></div>
        </div>

        <span class="title">{{ title }}</span>

        <div class="content">
            <slot></slot>
        </div>

        <div class="actions">
            <menu-button v-if="cancelText" class="menu-button" @click="onCancel()">
                {{ cancelText }}
            </menu-button>

            <menu-button class="menu-button" :class="{ warning: isWarning }" @click="onConfirm()">
                {{ confirmText || 'Proceed' }}
            </menu-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { AlertOutline, Pistol } from 'mdue';
import VanillaTilt from 'vanilla-tilt';
import * as uuid from 'uuid';

import store from '../../store';
import { soundKey } from '../../store/sound/sound.state';
import { dialogKey } from '../../store/dialog/dialog.state';
import { SoundOption } from '../../core/data-model/generic/sound-option';
import MenuButton from '../controls/MenuButton.vue';
import { SoundType } from '../../core/enums/sound-type.enum';

class DialogPanelProp {
    public title = prop<string>({ default: 'Are you sure?' });
    public confirmText = prop<string>({ default: 'Proceed' });
    public cancelText = prop<string>({ default: 'Cancel' });
    public isWarning = prop<boolean>({ default: false });
    public confirmHook = prop<(...args: any[]) => void>({ default: null });
}

@Options({
    components: {
        AlertOutline,
        Pistol,
        MenuButton
    }
})
export default class DialogPanel extends Vue.with(DialogPanelProp) {
    public readonly id = `dialog-panel-${uuid.v4()}`;

    public mounted(): void {
        const container = document.querySelector(`#${this.id}`);
        VanillaTilt.init(container as HTMLElement, { max: 2, glare: true, 'max-glare': 0.1 });
        store.dispatch(`${soundKey}/playSound`, new SoundOption('panel_open', SoundType.UI));
    }

    public onCancel(): void {
        store.dispatch(`${dialogKey}/close`);
    }

    public onConfirm(): void {
        if (this.confirmHook) {
            this.confirmHook();
        }

        store.dispatch(`${dialogKey}/close`);
    }
}
</script>

<style lang="scss" scoped>
.dialog-panel-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 25vw;
    min-height: 22.5vh;
    color: rgb(255, 255, 255);
    font-size: 0.65rem;
    opacity: 0;
    animation: revealContent 0.2s ease 0.1s forwards,
               blinkFast 0.15s ease-in 0.1s forwards;

    .header {
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.3rem 4.5% 0 4.5%;
        width: 100%;

        .icon {
            font-size: 0.8rem;
        }
    }

    .separator {
        position: relative;
        margin-top: 0.25rem;
        width: 0;
        height: 0.175rem;
        border-top: 1px solid rgba(200, 200, 200, 0.6);
        opacity: 0;
        animation: revealContent 0.2s ease 0.2s forwards,
                    expandSeparator 0.25s ease 0.35s forwards;

        div {
            position: absolute;
            bottom: 0;
            width: 0.35rem;
            height: 0.075rem;
            background-color: rgb(200, 200, 200);
        }

        div:first-of-type {
            left: -0.2rem;
        }

        div:last-of-type {
            right: -0.2rem;
        }

        @keyframes expandSeparator {
            from { width: 0 }
            to { width: 87.5% }
        }
    }

    .title {
        margin-top: 0.15rem;
        font-size: 0.55rem;
        opacity: 0;
        animation: revealContent 0.2s ease 0.5s forwards;
    }

    .content {
        display: flex;
        justify-items: center;
        align-items: center;
        flex-grow: 1;
    }

    .actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: auto;
        margin-bottom: 0.25rem;
        width: 100%;
        height: 1.25rem;

        .menu-button {
            margin-right: 3%;
            width: 20%;
            height: 85%;

            &:nth-last-child(2) {
                background-color: rgba(215, 215, 215, 0.05);
                opacity: 0;
                animation: revealContent 0.2s ease 0.62s forwards;

                &:hover {
                    background-color: rgb(215, 215, 215, 0.3);
                }
            }

            &:nth-last-child(1) {
                background-color: rgba(71, 179, 170, 0.65);
                opacity: 0;
                animation: revealContent 0.2s ease 0.6s forwards;

                &:hover {
                    background-color: rgb(50, 158, 149);
                }

                &.warning {
                    background-color: rgba(241, 58, 25, 0.65);
                }

                &.warning:hover {
                    background-color: rgb(226, 17, 10);
                }
            }
        }
    }
}
</style>
