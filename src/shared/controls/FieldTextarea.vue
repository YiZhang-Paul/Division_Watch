<template>
    <div class="field-textarea-container">
        <span>{{ name }}</span>

        <textarea cols="30"
            rows="7"
            v-model="content"
            :placeholder="placeholder"
            @input="$emit('update:modelValue', content)">
        </textarea>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

class FieldTextareaProp {
    public name = prop<string>({ default: '' });
    public placeholder = prop<string>({ default: 'add text here...' });
    public modelValue = prop<string>({ default: '' });
}

@Options({
    emits: ['update:modelValue']
})
export default class FieldTextarea extends Vue.with(FieldTextareaProp) {
    public content = this.modelValue;
}
</script>

<style lang="scss" scoped>
.field-textarea-container {
    $name-width: 45%;

    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 1.5% 3.5%;
    color: rgb(255, 255, 255);
    background-color: rgba(52, 51, 56, 0.8);
    font-family: 'Jost';

    & > span {
        align-self: baseline;
        margin-top: 0.1rem;
        width: $name-width;
        font-size: 0.5rem;
    }

    & > textarea {
        box-sizing: border-box;
        padding: 1.25%;
        width: calc(100% - #{$name-width});
        outline: none;
        border: none;
        resize: none;
        color: rgb(195, 195, 195);
        background-color: rgba(29, 29, 32, 0.8);
        font-size: 0.45rem;
        font-family: 'Jost';
    }
}
</style>
