<template>
    <div class="option-dropdown-container" :class="{ 'simple-view': useSimpleView }">
        <span>{{ name }}</span>

        <select :disabled="isDisabled"
            :class="{ 'disabled-dropdown': isDisabled }"
            @click="onClick()"
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

import store from '../../store';
import { soundKey } from '../../store/sound/sound.state';
import { SoundOption } from '../../core/data-model/generic/sound-option';
import { SoundType } from '../../core/enums/sound-type.enum';

class OptionDropdownProp {
    public name = prop<string>({ default: '' });
    public options = prop<string[]>({ default: [] });
    public selected = prop<any>({ default: null });
    public useSimpleView = prop<boolean>({ default: false });
    public isDisabled = prop<boolean>({ default: false });
    public disableText = prop<string>({ default: '' });
    public transform = prop<(_: any) => string>({ default: null });
}

@Options({
    emits: ['options:select']
})
export default class OptionDropdown extends Vue.with(OptionDropdownProp) {

    public onClick(): void {
        store.dispatch(`${soundKey}/playSound`, new SoundOption('button_hover', SoundType.UI));
    }

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
    padding: 1% 3.5%;
    color: rgb(255, 255, 255);
    background-color: rgba(52, 51, 56, 0.55);
    border-left: 1px solid rgba(200, 200, 200, 0.4);
    border-right: 1px solid rgba(200, 200, 200, 0.4);
    font-family: 'Jost';

    & > span {
        width: $name-width;
        font-size: 0.5rem;
    }

    select {
        display: block;
        padding: 0.75% 3%;
        margin: 0;
        width: calc(100% - #{$name-width});
        background-color: rgba(45, 45, 45, 0.7);
        background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='30' viewBox='0 0 24 24' width='30' xmlns='http://www.w3.org/2000/svg'><path d='M5 8l6 10 6-10z' fill='rgb(228, 122, 47)' /><path d='M0 0h24v24H0z' fill='none'/></svg>");
        background-repeat: no-repeat;
        background-position-x: 100%;
        color: rgb(255, 255, 255);
        border: none;
        border-radius: 3px;
        font-size: 0.4rem;
        font-family: 'Jost';
        appearance: none;
        transition: background-color 0.3s;

        &:hover {
            cursor: pointer;
            background-color: rgba(42, 42, 48, 0.8);
        }

        &:focus {
            background-color: rgba(44, 44, 48, 0.8);
            outline: none;
        }

        option {
            background-color: rgba(45, 45, 45, 0.7);
        }

        &.disabled-dropdown {
            cursor: not-allowed;
            background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='30' viewBox='0 0 24 24' width='30' xmlns='http://www.w3.org/2000/svg'><path d='M5 8l6 10 6-10z' fill='rgb(145, 145, 145)' /><path d='M0 0h24v24H0z' fill='none'/></svg>");
        }
    }

    &.simple-view {
        padding: 0;
        background-color: transparent;

        & > span {
            display: none;
        }

        select {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
