<template>
    <section-panel class="item-group-panel-container" :name="name" :isSubsection="true">
        <overlay-scrollbar-panel class="content">
            <div class="items">
                <slot></slot>
            </div>
        </overlay-scrollbar-panel>

        <div class="add-item-panel">
            <div class="panel-guard"></div>

            <display-panel class="add-item">
                <input type="text"
                    v-model="itemName"
                    :placeholder="placeholder"
                    @keyup.enter="onItemAdd"
                    @keyup.esc="itemName = ''" />

                <plus v-if="itemName" class="add-icon" @click="onItemAdd()" />
            </display-panel>
        </div>
    </section-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { Plus } from 'mdue';

import SectionPanel from '../panels/SectionPanel.vue';
import DisplayPanel from '../panels/DisplayPanel.vue';
import OverlayScrollbarPanel from '../panels/OverlayScrollbarPanel.vue';

class ItemGroupPanelProp {
    public name = prop<string>({ default: '' });
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
    $add-item-panel-height: 5.25vh;

    .content {
        width: 100%;
        height: calc(100% - #{$add-item-panel-height});

        .items {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        }
    }

    .add-item-panel {
        width: 100%;
        height: $add-item-panel-height;

        .panel-guard {
            margin-bottom: 1%;
            width: 100%;
            height: 7.5%;
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
}
</style>
