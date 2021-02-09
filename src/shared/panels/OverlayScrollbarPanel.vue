<template>
    <div :id="id"><slot></slot></div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import OverlayScrollbars from 'overlayscrollbars';
import * as uuid from 'uuid';

import { ScrollPosition } from '../../core/data-model/generic/scroll-position';

@Options({
    emits: [
        'created',
        'scroll'
    ]
})
export default class OverlayScrollbarPanel extends Vue {
    public readonly id = `overlay-scrollbar-panel-container-${uuid.v4()}`;

    public mounted(): void {
        const { offsetHeight, scrollHeight } = document.querySelector(`#${this.id}`) as HTMLElement;
        this.$emit('created', offsetHeight === scrollHeight ? null : new ScrollPosition());

        OverlayScrollbars(document.querySelectorAll(`#${this.id}`), {
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
