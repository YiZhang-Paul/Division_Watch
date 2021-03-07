<template>
    <dialog-panel :title="'This item will be permanently deleted.'"
        :confirmText="'Delete'"
        :confirmHook="confirmHook"
        :isWarning="true">
    </dialog-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import DialogPanel from '../../../shared/panels/DialogPanel.vue';

class DeleteChecklistDialogProp {
    public data = prop<any>({ default: null });
    public confirmHook = prop<(...args: any[]) => void>({ default: null });
}

@Options({
    components: {
        DialogPanel
    }
})
export default class DeleteChecklistDialog extends Vue.with(DeleteChecklistDialogProp) { }
</script>
