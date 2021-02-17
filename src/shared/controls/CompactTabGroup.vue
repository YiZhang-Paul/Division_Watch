<template>
    <div class="compact-tab-group-container">
        <div :class="getButtonClasses(index)"
            v-for="(option, index) of options"
            :key="option.name"
            @click="onSelect(index)">

            <component v-if="option.icon" class="icon" :is="option.icon"></component>
            <span>{{ option.name }}: {{ option.badgeValue }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import VanillaTilt from 'vanilla-tilt';
// eslint-disable-next-line no-unused-vars
import { TabGroupOption } from '../../core/data-model/generic/tab-group-option';

class CompactTabGroupProp {
    public options = prop<TabGroupOption[]>({ default: [] });
}

@Options({
    emits: ['tab:selected']
})
export default class CompactTabGroup extends Vue.with(CompactTabGroupProp) {
    public readonly buttonClass = 'compact-tab-button';
    public activeIndex = 0;

    public mounted(): void {
        const containers = document.querySelectorAll(`.${this.buttonClass}`);
        VanillaTilt.init(Array.from(containers) as HTMLElement[], { max: 0, glare: true, 'max-glare': 0.2 });
        this.$emit('tab:selected', this.activeIndex);
    }

    public getButtonClasses(index: number): { [key: string]: boolean } {
        return {
            [this.buttonClass]: true,
            'active-tab': index === this.activeIndex
        };
    }

    public onSelect(index: number): void {
        this.activeIndex = index;
        this.$emit('tab:selected', index);
    }
}
</script>

<style lang="scss" scoped>
.compact-tab-group-container {
    display: flex;

    .compact-tab-button {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 1.1% 0.6rem;
        border-left: 1px solid rgba(200, 200, 200, 0.4);
        border-right: 1px solid rgba(200, 200, 200, 0.4);
        background-color: rgba(0, 0, 0, 0.35);
        color: rgb(255, 255, 255);
        line-height: 0.6rem;
        font-size: 0.525rem;
        font-family: 'Jost';
        transition: background-color 0.3s, color 0.3s;

        &:hover {
            cursor: pointer;
            background-color: rgba(50, 50, 50, 0.55);
        }

        &.active-tab {
            background-color: rgb(245, 114, 8);
            color: rgb(15, 15, 15);
        }

        &:nth-child(1) {
            border-left-color: rgba(225, 225, 225, 0.65);
            border-right: none;
        }

        &:nth-last-child(1) {
            border-right-color: rgba(225, 225, 225, 0.65);
            border-left: none;
        }

        .icon {
            font-size: 0.65rem;
        }
    }
}
</style>
