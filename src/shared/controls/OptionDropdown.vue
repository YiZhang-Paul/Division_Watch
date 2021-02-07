<template>
    <div class="option-dropdown-container">
        <span>{{ name }}</span>

        <select :disabled="isDisabled"
            :class="{ 'disabled-dropdown': isDisabled }"
            @change="$emit('options:select', options[$event.target.value])">

            <option v-if="isDisabled">{{ disableText }}</option>

            <template v-if="!isDisabled">
                <option v-for="(option, index) of options"
                    :key="index"
                    :value="index"
                    :selected="isSelected(option)">

                    {{ tryApplyTransform(option) }}
                </option>
            </template>
        </select>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import DisplayPanel from '../panels/DisplayPanel.vue';

class OptionDropdownProp {
    public name = prop<string>({ default: '' });
    public options = prop<string[]>({ default: [] });
    public selected = prop<any>({ default: null });
    public isDisabled = prop<boolean>({ default: false });
    public disableText = prop<string>({ default: '' });
    public transform = prop<(_: any) => string>({ default: null });
}

@Options({
    components: { DisplayPanel },
    emits: ['options:select']
})
export default class OptionDropdown extends Vue.with(OptionDropdownProp) {

    public isSelected(option: any): boolean {
        if (!this.selected) {
            return false;
        }

        return this.tryApplyTransform(this.selected) === this.tryApplyTransform(option);
    }

    public tryApplyTransform(option: any): string {
        return this.transform ? this.transform(option) : String(option);
    }
}
</script>

<style lang="scss" scoped>
.option-dropdown-container {
    $name-width: 45%;

    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 1.5% 4%;
    color: rgb(255, 255, 255);
    background-color: rgba(52, 51, 56, 0.8);
    font-family: 'Jost';

    & > span {
        width: $name-width;
        font-size: 0.55rem;
    }

    select {
        display: block;
        padding: 1% 3%;
        margin: 0;
        width: calc(100% - #{$name-width});
        background-color: rgba(29, 29, 32, 0.8);
        background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='30' viewBox='0 0 24 24' width='30' xmlns='http://www.w3.org/2000/svg'><path d='M5 8l6 10 6-10z' fill='rgb(228, 122, 47)' /><path d='M0 0h24v24H0z' fill='none'/></svg>");
        background-repeat: no-repeat;
        background-position-x: 100%;
        color: rgb(255, 255, 255);
        border: none;
        border-radius: 3px;
        font-size: 0.4rem;
        font-family: 'Jost';
        appearance: none;

        &:focus {
            background-color: rgba(44, 44, 48, 0.8);
            outline: none;
        }

        option {
            background-color: rgba(51, 51, 54, 0.6);
        }

        &.disabled-dropdown {
            cursor: not-allowed;
            background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='30' viewBox='0 0 24 24' width='30' xmlns='http://www.w3.org/2000/svg'><path d='M5 8l6 10 6-10z' fill='rgb(145, 145, 145)' /><path d='M0 0h24v24H0z' fill='none'/></svg>");
        }
    }
}
</style>