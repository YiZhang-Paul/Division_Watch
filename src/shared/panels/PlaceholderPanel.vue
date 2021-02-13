<template>
    <div class="placeholder-panel-container">
        <span>{{ text }}</span>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

class PlaceholderPanelProp {
    public text = prop<string>({ default: '' });
}

export default class PlaceholderPanel extends Vue.with(PlaceholderPanelProp) { }
</script>

<style lang="scss" scoped>
.placeholder-panel-container {
    padding: 1rem 0.1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(235, 235, 235);
    font-size: 0.5rem;
}
</style>
