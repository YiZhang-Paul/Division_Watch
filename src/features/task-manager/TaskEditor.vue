<template>
    <glass-panel class="task-editor-container">
        <div v-if="!task" class="placeholder-panel">
            <input-panel class="placeholder-text" :hasAnimation="true">
                <div>No Task Selected.</div>
            </input-panel>
        </div>

        <div v-if="task">{{ task.name }}</div>
    </glass-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../store';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item';
import InputPanel from '../../shared/panels/InputPanel.vue';
import GlassPanel from '../../shared/panels/GlassPanel.vue';

@Options({
    components: {
        InputPanel,
        GlassPanel
    }
})
export default class TaskEditor extends Vue {

    get task(): TaskItem | null {
        return store.getters['taskItem/activeTaskItem'];
    }
}
</script>

<style lang="scss" scoped>
.task-editor-container {

    .placeholder-panel {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    .placeholder-text div {
        padding: 0.5em 0.75em;
        color: rgb(255, 255, 255);
        background-color: rgba(63, 62, 68, 0.6);
    }
}
</style>
