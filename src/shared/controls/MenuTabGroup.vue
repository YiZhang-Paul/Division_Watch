<template>
    <div class="tab-group-container">
        <menu-tab-button class="menu-tab-button"
            v-for="(option, index) of options"
            :key="index"
            :isActive="activeIndex === index"
            :icon="option.icon"
            :badgeValue="option.badgeValue"
            @click="onSelect(index)">

            {{ option.name }}
        </menu-tab-button>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import { TabGroupOption } from '../../core/data-model/generic/tab-group-option';

import MenuTabButton from './MenuTabButton.vue';

class TabGroupProp {
    public options = prop<TabGroupOption[]>({ default: [] });
}

@Options({
    components: {
        MenuTabButton
    },
    emits: ['tab:selected']
})
export default class TabGroup extends Vue.with(TabGroupProp) {
    public activeIndex = 0;

    public mounted(): void {
        this.$emit('tab:selected', this.activeIndex);
    }

    public onSelect(index: number): void {
        this.activeIndex = index;
        this.$emit('tab:selected', index);
    }
}
</script>

<style lang="scss" scoped>
.tab-group-container {
    display: flex;

    .menu-tab-button:not(:nth-last-child(1)) {
        margin-right: 1vh;
    }
}
</style>
