<template>
    <view-panel :maxTilt="1">
        <div class="content">
            <span>{{ title }}</span>

            <div class="actions">
                <menu-button class="menu-button" @click="$emit('confirmed')">
                    {{ cancelText }}
                </menu-button>

                <menu-button class="menu-button"
                    :class="{ warning: isWarning }"
                    @click="$emit('cancelled')">

                    {{ confirmText }}
                </menu-button>
            </div>
        </div>
    </view-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import MenuButton from '../controls/MenuButton.vue';

import ViewPanel from './ViewPanel.vue';

class ConfirmPanelProp {
    public title = prop<string>({ default: '' });
    public cancelText = prop<string>({ default: 'Cancel' });
    public confirmText = prop<string>({ default: 'Confirm' });
    public isWarning = prop<boolean>({ default: false });
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
export default class ConfirmPanel extends Vue.with(ConfirmPanelProp) { }
</script>

<style lang="scss" scoped>
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
            width: 20%;
            height: 85%;

            &:nth-child(1) {
                background-color: rgba(185, 185, 185, 0.2);
            }

            &:nth-child(2) {
                margin-left: 3%;

                &.warning {
                    background-color: rgba(241, 58, 25, 0.8);
                }

                &:hover {
                    background-color: rgb(240, 123, 14);
                }

                &.warning:hover {
                    background-color: rgb(226, 17, 10);
                }
            }
        }
    }
}
</style>
