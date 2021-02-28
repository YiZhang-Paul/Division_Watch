<template>
    <display-panel class="checkbox-container"
        :class="{ checked: modelValue }"
        @click="$emit('update:modelValue', !modelValue)">
    </display-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import DisplayPanel from '../panels/DisplayPanel.vue';

class CheckboxProp {
    public modelValue = prop<boolean>({ default: false });
}

@Options({
    components: {
        DisplayPanel
    },
    emits: ['update:modelValue']
})
export default class Checkbox extends Vue.with(CheckboxProp) { }
</script>

<style lang="scss" scoped>
.checkbox-container {
    background-color: rgba(29, 29, 32, 0.8);
    transition: background-color 0.3s;

    &:hover {
        cursor: pointer;
        background-color: rgba(56, 56, 65, 0.8);
    }

    &.checked {
        background-color: rgb(240, 123, 14);
    }
}
</style>
