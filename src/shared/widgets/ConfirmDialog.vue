<template>
    <dialog-panel :title="data.title"
        :confirmText="data.confirmText"
        :confirmHook="confirmHook"
        :isWarning="data.isWarning">
    </dialog-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import { ConfirmDialogOption } from '../../core/data-model/generic/confirm-dialog-option';
import DialogPanel from '../../shared/panels/DialogPanel.vue';

class ConfirmDialogProp {
    public data = prop<ConfirmDialogOption>({ default: null });
    public confirmHook = prop<(...args: any[]) => void>({ default: null });
}

@Options({
    components: {
        DialogPanel
    }
})
export default class ConfirmDialog extends Vue.with(ConfirmDialogProp) { }
</script>
