<template>
    <div v-if="option" class="confirm-panel-container">
        <view-panel class="view-panel" :class="$attrs.class" :maxTilt="2">
            <div class="content">
                <span>{{ option.title }}</span>

                <div class="actions">
                    <menu-button class="menu-button" @click="onCancel()">
                        {{ option.cancelText }}
                    </menu-button>

                    <menu-button class="menu-button"
                        :class="{ warning: option.isWarning }"
                        @click="onConfirm()">

                        {{ option.confirmText }}
                    </menu-button>
                </div>
            </div>
        </view-panel>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import { DialogOption } from '../../core/data-model/generic/dialog-option';
import MenuButton from '../controls/MenuButton.vue';

import ViewPanel from './ViewPanel.vue';

class ConfirmPanelProp {
    public option = prop<DialogOption>({ default: null });
}

@Options({
    components: {
        MenuButton,
        ViewPanel
    },
    emits: [
        'confirmed',
        'cancelled'
    ]
})
export default class ConfirmPanel extends Vue.with(ConfirmPanelProp) {

    public onConfirm(): void {
        if (this.option.confirmCallback) {
            this.option.confirmCallback();
        }

        this.$emit('confirmed');
    }

    public onCancel(): void {
        if (this.option.cancelCallback) {
            this.option.cancelCallback();
        }

        this.$emit('cancelled');
    }
}
</script>

<style lang="scss" scoped>
.confirm-panel-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
}

.content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    color: rgb(255, 255, 255);
    font-size: 0.75rem;

    .actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 100%;
        height: 30%;

        .menu-button {
            margin-right: 3%;
            width: 20%;
            height: 85%;

            &:nth-child(1) {
                background-color: rgba(185, 185, 185, 0.2);

                &:hover {
                    background-color: rgb(225, 225, 225, 0.2);
                }
            }

            &:nth-child(2) {

                &:hover {
                    background-color: rgb(240, 123, 14);
                }

                &.warning {
                    background-color: rgba(241, 58, 25, 0.8);
                }

                &.warning:hover {
                    background-color: rgb(226, 17, 10);
                }
            }
        }
    }
}
</style>
