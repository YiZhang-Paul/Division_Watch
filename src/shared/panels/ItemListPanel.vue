<template>
    <overlay-scrollbar-panel class="item-list-panel-container">
        <slot></slot>
    </overlay-scrollbar-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import OverlayScrollbarPanel from '../../shared/panels/OverlayScrollbarPanel.vue';

@Options({
    components: {
        OverlayScrollbarPanel
    }
})
export default class ItemListPanel extends Vue { }
</script>

<style lang="scss" scoped>
.item-list-panel-container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
</style>
