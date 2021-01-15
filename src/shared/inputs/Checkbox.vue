<template>
    <div class="check-box-container">
        <input-panel class="input-panel"
            :hasAnimation="false"
            :class="{ 'checked': checked }"
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
}

@Options({
    components: { InputPanel },
    emits: ['change']
})
export default class Checkbox extends Vue.with(CheckboxProp) {

    public onChange(): void {
        this.$emit('change', !this.checked);
    }
}
</script>

<style lang="scss" scoped>
.check-box-container {
    display: flex;
    align-items: center;

    .input-panel {
        margin-right: 5%;
        width: 0.45rem;
        height: 0.45rem;
        background-color: rgb(110, 110, 110);
        transition: background-color 0.3s;

        &:hover {
            cursor: pointer;
            background-color: rgb(135, 135, 135);
        }

        &.checked {
            background-color: rgb(228, 122, 47);
        }
    }
}
</style>
