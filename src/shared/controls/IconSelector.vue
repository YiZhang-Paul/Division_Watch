<template>
    <div class="icon-selector-container">
        <span>{{ name }}</span>

        <div class="icons">
            <div class="row" v-for="n in rows" :key="n">
                <component class="icon"
                    v-for="m in columns"
                    :key="m"
                    :class="{ 'selected-icon': getIconName(n, m) === selected }"
                    :is="getIcon(n, m)"
                    @click="$emit('select', getIconName(n, m))">
                </component>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import { GenericUtility } from '../../core/utilities/generic/generic.utility';

class IconSelectorProp {
    public name = prop<string>({ default: '' });
    public selected = prop<string>({ default: '' });
}

@Options({
    emits: ['select']
})
export default class IconSelector extends Vue.with(IconSelectorProp) {
    public readonly columns = 10;

    get rows(): number {
        return Math.ceil(this.icons.length / this.columns);
    }

    get icons(): string[] {
        return GenericUtility.getIconNames(false);
    }

    public getIconName(row: number, column: number): string {
        return this.icons[(row - 1) * this.columns + column - 1];
    }

    public getIcon(row: number, column: number): any {
        return GenericUtility.getIcon(this.getIconName(row, column));
    }
}
</script>

<style lang="scss" scoped>
.icon-selector-container {
    $name-width: 45%;

    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 1.5% 3.5%;
    color: rgb(255, 255, 255);
    background-color: rgba(52, 51, 56, 0.55);
    border-left: 1px solid rgba(200, 200, 200, 0.4);
    border-right: 1px solid rgba(200, 200, 200, 0.4);
    font-family: 'Jost';

    & > span {
        align-self: baseline;
        margin-top: 0.1rem;
        width: $name-width;
        font-size: 0.5rem;
    }

    .icons {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 0.15rem;
        width: calc(100% - #{$name-width});
        height: 100%;
        background-color: rgba(45, 45, 45, 0.7);

        .row {
            display: flex;
            justify-content: space-evenly;
            margin-top: 0.15rem;
            width: 100%;

            &:nth-last-child(1) {
                margin-bottom: 0.15rem;
            }
        }

        .icon {
            font-size: 0.9rem;
            transition: color 0.3s;

            &:hover {
                cursor: pointer;
                color: rgb(240, 123, 14);
            }

            &.selected-icon {
                color: rgb(240, 123, 14);
            }
        }
    }
}
</style>
