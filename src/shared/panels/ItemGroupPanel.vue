<template>
    <section-panel class="item-group-panel-container" :name="name" :isSubsection="true">
        <div class="content-wrapper">
            <div class="content">
                <overlay-scrollbar-panel class="items" @scroll="scroll = $event">
                    <div class="items-wrapper">
                        <slot></slot>
                    </div>
                </overlay-scrollbar-panel>

                <div class="add-item-panel" :class="{ 'disabled-panel': isDisabled }">
                    <div class="panel-guard"></div>

                    <display-panel class="add-item">
                        <input type="text"
                            v-model="itemName"
                            :placeholder="placeholder"
                            :disabled="isDisabled"
                            :maxlength="maxLength"
                            @keyup.enter="onItemAdd"
                            @keyup.esc="itemName = ''" />

                        <plus v-if="itemName" class="add-icon" @click="onItemAdd()" />
                    </display-panel>
                </div>

                <div v-if="scroll && !scroll.isTop" class="top-scroll-indicator"></div>
                <div v-if="scroll && !scroll.isBottom" class="bottom-scroll-indicator"></div>
            </div>
        </div>
    </section-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { Plus } from 'mdue';
// eslint-disable-next-line no-unused-vars
import { ScrollPosition } from '../../core/data-model/generic/scroll-position';
import SectionPanel from '../panels/SectionPanel.vue';
import DisplayPanel from '../panels/DisplayPanel.vue';
import OverlayScrollbarPanel from '../panels/OverlayScrollbarPanel.vue';

class ItemGroupPanelProp {
    public name = prop<string>({ default: '' });
    public maxLength = prop<number>({ default: 60 });
    public isDisabled = prop<boolean>({ default: false });
    public placeholder = prop<string>({ default: 'add item here...' });
}

@Options({
    components: {
        Plus,
        SectionPanel,
        DisplayPanel,
        OverlayScrollbarPanel
    },
    emits: ['item:add']
})
export default class ItemGroupPanel extends Vue.with(ItemGroupPanelProp) {
    public scroll: ScrollPosition | null = null;
    public itemName = '';

    public onItemAdd(): void {
        if (this.itemName) {
            this.$emit('item:add', this.itemName);
            this.itemName = '';
        }
    }
}
</script>

<style lang="scss" scoped>
.item-group-panel-container {
    $add-item-panel-height: 4.6vh;
    $scroll-indicator-color: rgba(14, 119, 240, 0.35);

    .content-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .content {
        $margin-left: 0.5rem;

        position: absolute;
        left: -$margin-left;
        width: calc(100% + #{$margin-left});
        height: 100%;

        .add-item-panel, .top-scroll-indicator, .bottom-scroll-indicator {
            margin-left: $margin-left;
            width: calc(100% - #{$margin-left});
        }

        .top-scroll-indicator, .bottom-scroll-indicator {
            position: absolute;
            left: 0;
            height: 5%;
            pointer-events: none;
            opacity: 0;
            animation: revealContent 0.6s ease forwards;
        }

        .top-scroll-indicator {
            top: 0;
            background-image: linear-gradient($scroll-indicator-color, transparent);
        }

        .bottom-scroll-indicator {
            bottom: $add-item-panel-height;
            background-image: linear-gradient(to top, $scroll-indicator-color, transparent);
        }
    }

    .items {
        width: 100%;
        height: calc(100% - #{$add-item-panel-height});

        .items-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        }
    }

    .add-item-panel {
        height: $add-item-panel-height;

        .panel-guard {
            margin-bottom: 1%;
            width: 100%;
            height: 6.5%;
            border-radius: 2px;
            background-color: rgb(240, 123, 14);
        }

        .add-item {
            box-sizing: border-box;
            display: flex;
            align-items: center;
            padding: 0 2.5% 0 5%;
            width: 100%;
            height: 91.5%;
            background-color: rgba(46, 45, 49, 0.8);

            input {
                flex-grow: 1;
                outline: none;
                border: none;
                background-color: transparent;
                color: rgb(225, 225, 225);
                font-family: 'Jost';
                font-size: 0.5rem;

                &::placeholder {
                    color: rgba(185, 185, 185, 0.85);
                }
            }

            .add-icon {
                margin-left: 2.5%;
                color: rgb(240, 123, 14);
                font-size: 0.85rem;
                filter: brightness(0.85);
                opacity: 0;
                transition: filter 0.3s;
                animation: revealContent 0.3s ease 0.2s forwards;

                &:hover {
                    cursor: pointer;
                    filter: brightness(1);
                }
            }
        }
    }

    .disabled-panel {

        .panel-guard {
            background-color: rgb(160, 160, 160);
        }

        .add-item:hover, .add-item input:hover {
            cursor: not-allowed;
        }
    }
}
</style>
