<template>
    <overlay-scrollbar-panel class="item-list-panel-container">
        <div class="content">
            <slot></slot>
        </div>
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

.content {
    padding-right: 10px;
}
</style>
