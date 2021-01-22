<template>
    <div class="icon-selector-container">
        <component v-for="icon of icons"
            class="icon"
            :key="icon"
            :is="getIcon(icon)"
            :class="{ active: active === icon }"
            :style="{ 'animation-delay': delay + 's' }"
            @click="$emit('icon:select', icon)">
        </component>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import { GenericUtility } from '../../core/utilities/generic/generic.utility';

class IconSelectorProp {
    public active = prop<string>({ default: '' });
    public delay = prop<number>({ default: 1 });
}

@Options({
    emits: ['icon:select']
})
export default class IconSelector extends Vue.with(IconSelectorProp) {
    public icons = GenericUtility.getIconNames();

    public getIcon(name: string): any {
        return GenericUtility.getIcon(name);
    }
}
</script>

<style lang="scss" scoped>
.icon-selector-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .icon {
        margin-right: 2%;
        color: rgb(255, 255, 255);
        filter: brightness(0.6);
        opacity: 0;
        animation: revealContent 0.3s ease-in forwards;
        transition: filter 0.3s;

        &:hover {
            cursor: pointer;
            filter: brightness(1);
        }

        &.active {
            color: rgb(42, 133, 236);
            filter: brightness(1);
        }
    }
}
</style>
