<template>
    <div v-if="option" class="confirm-panel-container">
        <div :id="id" class="content glass-panel-light">
            <div class="separator">
                <div></div>
                <div></div>
            </div>

            <span class="title">{{ option.title }}</span>

            <div v-if="option.checkboxText" class="checkbox-area">
                <checkbox class="checkbox" v-model="isChecked" />
                <span>{{ option.checkboxText }}</span>
            </div>

            <div class="dropdown-area" v-if="option.dropdown">
                <span>{{ option.dropdown.text }}</span>

                <option-dropdown class="option-dropdown"
                    :useSimpleView="true"
                    :options="option.dropdown.options"
                    :selected="selected"
                    :transform="option.dropdown.transform"
                    @options:select="selected = $event">
                </option-dropdown>
            </div>

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
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import VanillaTilt from 'vanilla-tilt';
import * as uuid from 'uuid';
// eslint-disable-next-line no-unused-vars
import { DialogOption } from '../../core/data-model/generic/dialog-option';
import MenuButton from '../controls/MenuButton.vue';
import Checkbox from '../controls/Checkbox.vue';
import OptionDropdown from '../controls/OptionDropdown.vue';

class ConfirmPanelProp {
    public option = prop<DialogOption<any>>({ default: null });
}

@Options({
    components: {
        MenuButton,
        Checkbox,
        OptionDropdown
    },
    emits: [
        'confirmed',
        'cancelled'
    ]
})
export default class ConfirmPanel extends Vue.with(ConfirmPanelProp) {
    public readonly id = `content-panel-${uuid.v4()}`;
    public isChecked = false;
    public selected = this.option.dropdown?.selected ?? this.option.dropdown?.options?.[0];

    public mounted(): void {
        const container = document.querySelector(`#${this.id}`);
        VanillaTilt.init(container as HTMLElement, { max: 2, glare: true, 'max-glare': 0.1 });
    }

    public onConfirm(): void {
        if (this.option.confirmCallback) {
            this.option.confirmCallback(this.isChecked, this.selected);
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

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 25vw;
        min-height: 20vh;
        color: rgb(255, 255, 255);
        font-size: 0.7rem;
        opacity: 0;
        animation: revealContent 0.2s ease 0.1s forwards,
                   blinkFast 0.15s ease-in 0.1s forwards;

        .separator {
            position: relative;
            margin-top: 0.5rem;
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
            opacity: 0;
            animation: revealContent 0.2s ease 0.3s forwards;
        }

        .checkbox-area, .dropdown-area {
            display: flex;
            align-self: flex-start;
            align-items: center;
            margin-top: auto;
            margin-left: 1.5rem;
            height: 1rem;
            font-size: 0.5rem;
        }

        .checkbox-area {

            .checkbox {
                margin-right: 0.25rem;
                width: 0.6rem;
                height: 0.6rem;
            }
        }

        .dropdown-area {

            span {
                margin-right: 0.25rem;
            }

            .option-dropdown {
                min-width: 5rem;
                height: 85%;
            }
        }

        .actions {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-top: auto;
            margin-bottom: 0.5rem;
            width: 100%;
            height: 1.25rem;

            .menu-button {
                margin-right: 3%;
                width: 20%;
                height: 85%;

                &:nth-child(1) {
                    background-color: rgba(215, 215, 215, 0.05);

                    &:hover {
                        background-color: rgb(215, 215, 215, 0.3);
                    }
                }

                &:nth-child(2) {
                    background-color: rgba(71, 179, 170, 0.65);

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
}
</style>
