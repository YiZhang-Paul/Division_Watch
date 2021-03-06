<template>
    <div class="item-list-panel-container">
        <div class="actions">
            <div v-if="allowAdd" class="button-wrapper">
                <plus class="add-item-button" @click="$emit('item:add')" />
            </div>

            <search-box class="search-box" @search="$emit('item:search', $event)"></search-box>
        </div>

        <overlay-scrollbar-panel class="scroll-panel" @scroll="scroll = $event">
            <div class="content">
                <slot></slot>
            </div>
        </overlay-scrollbar-panel>

        <div v-if="scroll && !scroll.isTop" class="top-scroll-indicator"></div>
        <div v-if="scroll && !scroll.isBottom" class="bottom-scroll-indicator"></div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { Plus } from 'mdue';
// eslint-disable-next-line no-unused-vars
import { ScrollPosition } from '../../core/data-model/generic/scroll-position';
import OverlayScrollbarPanel from '../../shared/panels/OverlayScrollbarPanel.vue';
import SearchBox from '../../shared/controls/SearchBox.vue';

class ItemListPanelProp {
    public allowAdd = prop<boolean>({ default: true });
}

@Options({
    components: {
        Plus,
        OverlayScrollbarPanel,
        SearchBox
    },
    emits: [
        'item:search',
        'item:add'
    ]
})
export default class ItemListPanel extends Vue.with(ItemListPanelProp) {
    public scroll: ScrollPosition | null = null;
}
</script>

<style lang="scss" scoped>
$padding-right: 10px;

.item-list-panel-container {
    $scroll-indicator-color: rgba(14, 119, 240, 0.35);
    $actions-height: 9%;
    $content-width: calc(100% - #{$padding-right});

    position: relative;

    .actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: $content-width;
        height: $actions-height;

        .button-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 3%;
            width: 0.8rem;
            height: 0.8rem;
            border-radius: 50%;
            background-color: rgb(216, 124, 37);

            &:hover {
                cursor: pointer;

                .add-item-button {
                    filter: brightness(1);
                }
            }

            .add-item-button {
                color: rgb(250, 250, 250);
                filter: brightness(0.85);
                transition: filter 0.3s;
            }
        }

        .search-box {
            flex-grow: 1;
            height: 50%;
        }
    }

    .scroll-panel {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: calc(100% - #{$actions-height});
    }

    .top-scroll-indicator, .bottom-scroll-indicator {
        position: absolute;
        left: 0;
        width: $content-width;
        height: 5%;
        pointer-events: none;
        opacity: 0;
        animation: revealContent 0.6s ease forwards;
    }

    .top-scroll-indicator {
        top: $actions-height;
        background-image: linear-gradient($scroll-indicator-color, transparent);
    }

    .bottom-scroll-indicator {
        bottom: 0;
        background-image: linear-gradient(to top, $scroll-indicator-color, transparent);
    }
}

.content {
    padding-right: $padding-right;
}
</style>
