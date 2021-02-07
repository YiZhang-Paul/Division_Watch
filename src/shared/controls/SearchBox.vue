<template>
    <display-panel class="search-box-container">
        <magnify class="icon" />
        <input type="text" placeholder="search here..." @input="onSearch($event.target.value)" />
    </display-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Magnify } from 'mdue';

import DisplayPanel from '../panels/DisplayPanel.vue';

@Options({
    components: {
        Magnify,
        DisplayPanel
    },
    emits: ['search']
})
export default class SearchBox extends Vue {

    public onSearch(text: string): void {
        this.$emit('search', (text ?? '').toLowerCase());
    }
}
</script>

<style lang="scss" scoped>
.search-box-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.5%;
    background-color: rgba(36, 35, 38, 0.75);
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.75rem;

    input {
        flex-grow: 1;
        border: none;
        outline: none;
        background-color: transparent;
        color: rgba(255, 255, 255, 0.9);
        font-family: 'Jost';
        font-size: 0.5rem;
    }
}
</style>
