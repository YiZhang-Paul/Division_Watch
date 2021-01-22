<template>
    <div class="check-box-container">
        <input-panel class="input-panel"
            :hasAnimation="false"
            :class="{ 'checked': checked, 'disabled': disabled }"
            @click="onChange()">
        </input-panel>

        <span>{{ name }}</span>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import InputPanel from '../panels/InputPanel.vue';

class CheckboxProp {
    public name = prop<string>({ default: '' });
    public checked = prop<boolean>({ default: false });
    public disabled = prop<boolean>({ default: false });
}

@Options({
    components: { InputPanel },
    emits: ['update:checked']
})
export default class Checkbox extends Vue.with(CheckboxProp) {

    public onChange(): void {
        if (!this.disabled) {
            this.$emit('update:checked', !this.checked);
        }
    }
}
</script>

<style lang="scss" scoped>
.check-box-container {
    display: flex;
    align-items: center;

    .input-panel {
        $dimension: 0.45rem;

        margin-right: 5%;
        min-width: $dimension;
        min-height: $dimension;
        width: $dimension;
        height: $dimension;
        background-color: rgb(110, 110, 110);
        transition: background-color 0.3s;

        &:hover:not(.disabled) {
            cursor: pointer;
            background-color: rgb(135, 135, 135);
        }

        &.checked, &.checked:hover {
            background-color: rgb(228, 122, 47);
        }

        &.disabled {
            cursor: not-allowed;
        }
    }
}
</style>
