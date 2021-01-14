<template>
    <div class="task-manager-container">
        <top-toolbar class="top-toolbar" :actions="actions"></top-toolbar>

        <div class="contents">
            <task-selector class="task-selector"></task-selector>
            <task-editor class="task-editor"></task-editor>
        </div>
    </div>
</template>

<script lang="ts">
import { markRaw } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { Cog, CheckBold, Finance } from 'mdue';

import { ActionButton } from '../../core/data-model/action-button';
import GlassPanel from '../../shared/panels/GlassPanel.vue';
import TopToolbar from '../../shared/components/TopToolbar.vue';

import TaskSelector from './TaskSelector.vue';
import TaskEditor from './TaskEditor.vue';

@Options({
    components: {
        Cog,
        CheckBold,
        Finance,
        GlassPanel,
        TopToolbar,
        TaskSelector,
        TaskEditor
    }
})
export default class TaskManager extends Vue {
    public actions: ActionButton[] = [
        markRaw(new ActionButton('stats', Finance, 'rgb(33, 188, 254)')),
        markRaw(new ActionButton('settings', Cog, 'rgb(255, 255, 255)')),
        markRaw(new ActionButton('close', CheckBold, 'rgb(21, 200, 39)'))
    ];
}
</script>

<style lang="scss" scoped>
.task-manager-container {
    $top-toolbar-height: 8%;
    $task-selector-width: 40%;

    display: flex;
    flex-direction: column;

    .contents {
        display: flex;
        margin-top: 1em;
        width: 100%;
        height: calc(100% - #{$top-toolbar-height});
    }

    .top-toolbar {
        width: 100%;
        height: $top-toolbar-height;
    }

    .task-selector {
        width: $task-selector-width;
        height: 100%;
    }

    .task-editor {
        margin-left: 1em;
        width: calc(100% - #{$task-selector-width});
        height: 100%;
    }
}
</style>
