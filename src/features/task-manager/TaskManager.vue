<template>
    <div class="task-manager-container">
        <top-toolbar class="top-toolbar" :actions="actions"></top-toolbar>

        <div class="contents">
            <item-selector class="item-selector"></item-selector>
            <item-editor class="item-editor"></item-editor>
        </div>
    </div>
</template>

<script lang="ts">
import { markRaw } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { Cog, CheckBold, Finance } from 'mdue';

import store from '../../store';
import { ActionButton } from '../../core/data-model/action-button';
import GlassPanel from '../../shared/panels/GlassPanel.vue';
import TopToolbar from '../../shared/components/TopToolbar.vue';

import ItemSelector from './ItemSelector.vue';
import ItemEditor from './ItemEditor.vue';

@Options({
    components: {
        Cog,
        CheckBold,
        Finance,
        GlassPanel,
        TopToolbar,
        ItemSelector,
        ItemEditor
    }
})
export default class TaskManager extends Vue {
    public actions: ActionButton[] = [
        markRaw(new ActionButton('stats', Finance, 'rgb(33, 188, 254)')),
        markRaw(new ActionButton('settings', Cog, 'rgb(255, 255, 255)')),
        markRaw(new ActionButton('close', CheckBold, 'rgb(21, 200, 39)'))
    ];

    public async created(): Promise<void> {
        const date = new Date().toISOString().replace(/T.*/g, '');
        await store.dispatch('taskItem/loadTaskItemOptions', date);
        await store.dispatch('category/loadCategories');
    }
}
</script>

<style lang="scss" scoped>
.task-manager-container {
    $top-toolbar-height: 8%;
    $item-selector-width: 40%;

    display: flex;
    flex-direction: column;

    .contents {
        display: flex;
        margin-top: 1%;
        width: 100%;
        height: calc(100% - #{$top-toolbar-height});
    }

    .top-toolbar {
        width: 100%;
        height: $top-toolbar-height;
    }

    .item-selector {
        width: $item-selector-width;
        height: 100%;
    }

    .item-editor {
        margin-left: 1%;
        width: calc(100% - #{$item-selector-width});
        height: 100%;
    }
}
</style>
