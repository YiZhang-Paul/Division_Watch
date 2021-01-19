<template>
    <input-panel class="confirm-panel-container" :class="{ 'confirming': isConfirming, 'warning': isWarning }">
        <div class="content" @click="isConfirming = true">
            <span v-if="!isConfirming">{{ displayText }}</span>

            <template v-if="isConfirming">
                <span>{{ displayText }}</span>

                <div class="actions">
                    <input-panel class="confirm-button" :delay="0" @click="$emit('confirm')">
                        <div class="action-content">{{ confirmText }}</div>
                    </input-panel>

                    <input-panel :delay="0" @click.stop="isConfirming = false">
                        <div class="action-content">{{ cancelText }}</div>
                    </input-panel>
                </div>
            </template>
        </div>
    </input-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import InputPanel from '../../shared/panels/InputPanel.vue';

class ConfirmPanelProp {
    public isWarning = prop<boolean>({ default: false });
    public displayText = prop<string>({ default: 'confirm' });
    public confirmText = prop<string>({ default: 'Confirm' });
    public cancelText = prop<string>({ default: 'Cancel' });
}

@Options({
    components: { InputPanel },
    watch: {
        isConfirming(current: boolean, previous: boolean): void {
            if (!previous && current) {
                this.$emit('confirm:start');
            }
        }
    },
    emits: [
        'confirm:start',
        'confirm:confirmed'
    ]
})
export default class ConfirmPanel extends Vue.with(ConfirmPanelProp) {
    public isConfirming = false;
}
</script>

<style lang="scss" scoped>
.confirm-panel-container {

    &:not(.confirming) .content {
        cursor: pointer;
        background-color: rgb(84, 83, 92);
    }

    &:hover:not(.confirming) .content {
        background-color: rgb(110, 109, 121);
    }

    &.warning:not(.confirming) .content {
        background-color: rgb(109, 13, 13);
    }

    &.warning:hover:not(.confirming) .content {
        background-color: rgb(134, 24, 24);
    }

    .content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0.3rem 0.65rem;
        color: rgb(255, 255, 255);
        background-color: rgba(63, 62, 68, 0.6);
        font-family: 'Bruno Ace';
        font-size: 0.4rem;
        white-space: nowrap;
        transition: background-color 0.3s;

        .actions {
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin-top: 0.5rem;
            width: 100%;

            .action-content {
                padding: 0.12rem 0.23rem;
                cursor: pointer;
                color: rgb(255, 255, 255);
                background-color: rgb(84, 83, 92);
                font-family: 'Bruno Ace';
                font-size: 0.4rem;
                transition: background-color 0.3s;

                &:hover {
                    background-color: rgb(110, 109, 121);
                }
            }

            .confirm-button {
                margin-right: 0.4rem;

                .action-content {
                    background-color: rgb(226, 118, 30);

                    &:hover {
                        background-color: rgb(238, 147, 74);
                    }
                }
            }
        }
    }

    &.warning .content .confirm-button .action-content {
        background-color: rgb(175, 13, 13);

        &:hover {
            background-color: rgb(206, 32, 32);
        }
    }
}
</style>
