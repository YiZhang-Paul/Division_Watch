<template>
    <div :class="id"><slot></slot></div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import OverlayScrollbars from 'overlayscrollbars';

export default class OverlayScrollbarPanel extends Vue {
    public readonly id = 'overlay-scrollbar-panel-container';

    public mounted(): void {
        OverlayScrollbars(document.querySelectorAll(`.${this.id}`), {
            scrollbars: {
                autoHide: 'leave',
                autoHideDelay: 125
            }
        });
    }
}
</script>
