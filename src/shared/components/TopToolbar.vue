<template>
    <glass-panel>
        <div class="content">
            <div class="search">search</div>

            <component v-for="action of actions"
                :key="action.name"
                :style="{ color: action.color }"
                :is="action.icon"
                @click="$emit('action:' + action.name)">
            </component>
        </div>
    </glass-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import { ActionButton } from '../../core/data-model/action-button';
import GlassPanel from '../panels/GlassPanel.vue';

class TopToolbarProp {
    public hasSearch = prop<boolean>({ default: true });
    public actions = prop<ActionButton[]>({ default: [] });
}

@Options({
    components: {
        GlassPanel
    }
})
export default class TopToolbar extends Vue.with(TopToolbarProp) { }
</script>

<style lang="scss" scoped>
.content {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: relative;
    width: 100%;
    height: 100%;

    .search {
        display: flex;
        align-items: center;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 60%;
        height: 70%;
    }
}
</style>
