<template>
    <div class="item-list-panel-container">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class ItemListPanel extends Vue { }
</script>

<style lang="scss" scoped>
.item-list-panel-container {
    display: flex;
    flex-direction: column;
    border: 1px solid red;
}
</style>
