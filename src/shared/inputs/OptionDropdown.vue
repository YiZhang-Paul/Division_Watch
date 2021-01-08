<template>
    <input-panel class="option-dropdown-container">
        <div class="edit-item-content">
            <span>{{ name }}</span>

            <select @change="$emit('options:select', option)">
                <option v-for="option of options" :key="option" :value="option">
                    {{ option }}
                </option>
            </select>
        </div>
    </input-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import InputPanel from '../panels/InputPanel.vue';

class OptionDropdownProp {
    public name = prop<string>({ default: '' });
    public options = prop<string[]>({ default: [] });
}

@Options({
    components: { InputPanel },
    emits: ['options:select']
})
export default class OptionDropdown extends Vue.with(OptionDropdownProp) { }
</script>

<style lang="scss" scoped>
.option-dropdown-container {

    .edit-item-content {
        display: flex;
        align-items: center;
        padding: 0.5em 1.25em;
        color: rgb(255, 255, 255);
        background-color: rgba(63, 62, 68, 0.6);

        & > span {
            flex-basis: 45%;
            font-family: 'Bruno Ace';
        }

        select {
            display: block;
            flex-basis: 55%;
            padding: 0.25em 0.75em;
            margin: 0;
            width: 100%;
            max-width: 100%;
            background-color: rgba(51, 51, 54, 0.6);
            background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M5 8l6 10 6-10z' fill='rgb(228, 122, 47)' /><path d='M0 0h24v24H0z' fill='none'/></svg>");
            background-repeat: no-repeat;
            background-position-x: 100%;
            color: rgb(255, 255, 255);
            border: none;
            border-radius: 3px;
            font-size: 0.85em;
            font-family: 'Segoe UI';
            appearance: none;

            &:focus {
                background-color: rgba(72, 72, 77, 0.6);
                outline: none;
            }

            option {
                background-color: rgba(51, 51, 54, 0.6);
            }
        }
    }
}
</style>
