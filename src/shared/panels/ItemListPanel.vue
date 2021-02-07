<template>
    <div class="item-list-panel-container">
        <overlay-scrollbar-panel class="scroll-panel" @created="scroll = $event" @scroll="scroll = $event">
            <div class="content">
                <slot></slot>
            </div>
        </overlay-scrollbar-panel>

        <div v-if="scroll && !scroll.isTop" class="top-scroll-indicator"></div>
        <div v-if="scroll && !scroll.isBottom" class="bottom-scroll-indicator"></div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import { ScrollPosition } from '../../core/data-model/generic/scroll-position';
import OverlayScrollbarPanel from '../../shared/panels/OverlayScrollbarPanel.vue';

@Options({
    components: {
        OverlayScrollbarPanel
    }
})
export default class ItemListPanel extends Vue {
    public scroll: ScrollPosition | null = null;

    get containerClasses(): { [key: string]: boolean } {
        return {
            'top-scroll-indicator': !!this.scroll && !this.scroll.isTop,
            'bottom-scroll-indicator': !!this.scroll && !this.scroll.isBottom
        };
    }
}
</script>

<style lang="scss" scoped>
$padding-right: 10px;

.item-list-panel-container {
    $scroll-indicator-color: rgba(14, 119, 240, 0.35);

    position: relative;

    .top-scroll-indicator, .bottom-scroll-indicator {
        position: absolute;
        left: 0;
        width: calc(100% - #{$padding-right});
        height: 7.5%;
        pointer-events: none;
    }

    .top-scroll-indicator {
        top: 0;
        background-image: linear-gradient($scroll-indicator-color, transparent);
    }

    .bottom-scroll-indicator {
        bottom: 0;
        background-image: linear-gradient(to top, $scroll-indicator-color, transparent);
    }

    .scroll-panel {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }
}

.content {
    padding-right: $padding-right;
}
</style>
