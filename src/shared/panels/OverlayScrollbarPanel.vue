<template>
    <div :id="id"><slot></slot></div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import OverlayScrollbars from 'overlayscrollbars';
import * as uuid from 'uuid';

import { ScrollPosition } from '../../core/data-model/generic/scroll-position';

@Options({
    emits: ['scroll']
})
export default class OverlayScrollbarPanel extends Vue {
    public readonly id = `overlay-scrollbar-panel-container-${uuid.v4()}`;
    private position: ScrollPosition | null = null;

    public mounted(): void {
        const { offsetHeight, scrollHeight } = document.querySelector(`#${this.id}`) as HTMLElement;
        this.emitPosition(offsetHeight === scrollHeight ? null : new ScrollPosition());

        OverlayScrollbars(document.querySelectorAll(`#${this.id}`), {
            scrollbars: {
                autoHide: 'leave',
                autoHideDelay: 125
            },
            callbacks: {
                onOverflowChanged: (event: any): void => {
                    if (!event.clipped) {
                        this.emitPosition(null);
                    }
                    else {
                        const isTop = this.position ? this.position.isTop : true;
                        this.emitPosition(new ScrollPosition(isTop, false));
                    }
                },
                onScroll: (event: any): void => {
                    const { offsetHeight, scrollTop, scrollHeight } = event.target;
                    this.emitPosition(new ScrollPosition(!scrollTop, scrollTop + offsetHeight === scrollHeight));
                }
            }
        });
    }

    private emitPosition(position: ScrollPosition | null): void {
        this.position = position;
        this.$emit('scroll', position);
    }
}
</script>
