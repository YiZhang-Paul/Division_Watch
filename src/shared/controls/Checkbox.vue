<template>
    <display-panel class="checkbox-container" :class="{ checked }" @click="onToggle()"></display-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import DisplayPanel from '../panels/DisplayPanel.vue';

class CheckboxProp {
    public isChecked = prop<boolean>({ default: false });
}

@Options({
    components: {
        DisplayPanel
    },
    emits: ['change']
})
export default class Checkbox extends Vue.with(CheckboxProp) {
    public checked = this.isChecked;

    public onToggle(): void {
        this.checked = !this.checked;
        this.$emit('change', this.checked);
    }
}
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
