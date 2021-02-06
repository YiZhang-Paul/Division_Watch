<template>
    <div :class="id"><slot></slot></div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import OverlayScrollbars from 'overlayscrollbars';

import { ScrollPosition } from '../../core/data-model/generic/scroll-position';

@Options({
    emits: ['scroll']
})
export default class OverlayScrollbarPanel extends Vue {
    public readonly id = 'overlay-scrollbar-panel-container';

    public mounted(): void {
        OverlayScrollbars(document.querySelectorAll(`.${this.id}`), {
            scrollbars: {
                autoHide: 'leave',
                autoHideDelay: 125
            },
            callbacks: {
                onScroll: (event: any): void => {
                    const { offsetHeight, scrollTop, scrollHeight } = event.target;
                    this.$emit('scroll', new ScrollPosition(!scrollTop, scrollTop + offsetHeight === scrollHeight));
                }
            }
        });
    }
}
</script>
