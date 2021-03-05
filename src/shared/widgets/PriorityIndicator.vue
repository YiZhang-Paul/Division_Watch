<template>
    <div class="priority-indicator-container">
        <chevron-up class="arrow-icon"
            v-for="n in 3"
            :key="n"
            :class="{ 'glowing-arrow': isGlowing }"
            :style="getArrowStyle(n - 1)" />
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { ChevronUp } from 'mdue';

import { GenericUtility } from '../../core/utilities/generic/generic.utility';

class PriorityIndicatorProp {
    public priority = prop<number>({ default: 0 });
    public isGlowing = prop<boolean>({ default: false });
}

@Options({
    components: {
        ChevronUp
    }
})
export default class PriorityIndicator extends Vue.with(PriorityIndicatorProp) {

    get priorityColor(): string {
        return GenericUtility.getPriorityColor(this.priority);
    }

    public getArrowStyle(index: number): { [key: string]: string | null } {
        const color = index <= this.priority ? this.priorityColor : null;

        return { '--priority-indicator-color': color, color };
    }
}
</script>

<style lang="scss" scoped>
.priority-indicator-container {
    $dimension: 1rem;
    $font-size: 1.275rem;
    $inactive-color: rgba(170, 170, 170, 0.45);

    position: relative;
    width: $dimension;
    height: $dimension;
    overflow: hidden;
    color: $inactive-color;
    font-size: $font-size;

    .arrow-icon {
        $distance: 0.265rem;
        $margin: calc((#{$dimension} - #{$font-size}) / 2);

        position: absolute;
        top: $margin;
        left: $margin;

        &.glowing-arrow {
            animation: glowArrow 1s ease infinite;
        }

        &:nth-child(1) {
            top: calc(#{$margin} + #{$distance});
        }

        &:nth-child(3) {
            top: calc(#{$margin} - #{$distance});
        }
    }

    @keyframes glowArrow {
        0% {
            color: var(--priority-indicator-color);
        }
        50% {
            color: $inactive-color;
        }
        100% {
            color: var(--priority-indicator-color);
        }
    }
}
</style>
