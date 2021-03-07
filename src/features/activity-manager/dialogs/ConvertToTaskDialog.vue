<template>
    <dialog-panel :title="'This interruption will be converted to a task.'"
        :confirmText="'Convert'"
        :confirmHook="confirmHook">
    </dialog-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../../core/data-model/task-item/task-item';
import DialogPanel from '../../../shared/panels/DialogPanel.vue';

class ConvertToTaskDialogProp {
    public data = prop<TaskItem>({ default: null });
    public confirmHook = prop<(...args: any[]) => void>({ default: null });
}

@Options({
    components: {
        DialogPanel
    }
})
export default class ConvertToTaskDialog extends Vue.with(ConvertToTaskDialogProp) { }
</script>
