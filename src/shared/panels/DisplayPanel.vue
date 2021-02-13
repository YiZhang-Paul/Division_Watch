<template>
    <div class="display-panel-container">
        <div class="corner-grid" v-for="n in 4" :key="n"></div>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class DisplayPanel extends Vue { }
</script>

<style lang="scss" scoped>
.display-panel-container {
    position: relative;

    .corner-grid {
        position: absolute;
        width: 2px;
        height: 2px;
        background-color: rgb(200, 200, 200);

        &:nth-child(1) {
            top: 0;
            left: 0;
        }

        &:nth-child(2) {
            top: 0;
            right: 0;
        }

        &:nth-child(3) {
            bottom: 0;
            left: 0;
        }

        &:nth-child(4) {
            bottom: 0;
            right: 0;
        }
    }
}
</style>
