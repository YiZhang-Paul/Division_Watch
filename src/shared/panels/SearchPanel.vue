<template>
    <input-panel class="search-panel-container">
        <div class="content">
            <magnify class="icon" />
            <input type="search" placeholder="quick search" @input="$emit('search', $event.target.value)" />
        </div>
    </input-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Magnify } from 'mdue';

import InputPanel from './InputPanel.vue';

@Options({
    components: {
        Magnify,
        InputPanel
    },
    emits: ['search']
})
export default class SearchPanel extends Vue { }
</script>

<style lang="scss" scoped>
.search-panel-container {

    .content {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: rgba(63, 62, 68, 0.6);
        color: rgba(238, 238, 238, 0.6);

        .icon {
            margin-left: 0.25em;
            margin-right: 0.1em;
            font-size: 1.75em;
        }

        input {
            width: 90%;
            border: none;
            background-color: transparent;
            color: rgba(238, 238, 238, 0.6);
            caret-color: rgba(238, 238, 238, 0.6);
            font-size: 1em;
            outline: none;
        }

        input::-webkit-search-cancel-button {
            -webkit-appearance: none;
        }
    }
}
</style>
