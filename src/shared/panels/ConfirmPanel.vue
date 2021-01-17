<template>
    <input-panel class="confirm-panel-container" :class="{ 'confirming': isConfirming }">
        <div class="content" @click="isConfirming = true">
            <span v-if="!isConfirming">{{ displayText }}</span>

            <template v-if="isConfirming">
                <span>{{ alertText }}</span>

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
    public displayText = prop<string>({ default: 'confirm' });
    public alertText = prop<string>({ default: 'Are you sure?' });
    public confirmText = prop<string>({ default: 'Confirm' });
    public cancelText = prop<string>({ default: 'Cancel' });
}

@Options({
    components: { InputPanel },
    emits: ['confirm']
})
export default class ConfirmPanel extends Vue.with(ConfirmPanelProp) {
    public isConfirming = false;
}
</script>

<style lang="scss" scoped>
.confirm-panel-container {
    transition: background-color 0.3s;

    &:hover:not(.confirming) {
        cursor: pointer;
        background-color: rgb(250, 138, 46);
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
        font-size: 0.5rem;
        white-space: nowrap;

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
}
</style>