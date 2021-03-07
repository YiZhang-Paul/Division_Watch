<template>
    <dialog-panel :title="'This item will be permanently deleted.'"
        :confirmText="'Delete'"
        :confirmHook="onConfirm"
        :isWarning="true">

        <div v-if="showCheckbox" class="content">
            <checkbox class="checkbox" v-model="keepChildren" />
            <span @click="keepChildren = !keepChildren">do not remove child tasks</span>
        </div>
    </dialog-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../../core/data-model/task-item/task-item';
import DialogPanel from '../../../shared/panels/DialogPanel.vue';
import Checkbox from '../../../shared/controls/Checkbox.vue';

class DeleteTaskDialogProp {
    public data = prop<TaskItem>({ default: null });
    public confirmHook = prop<(...args: any[]) => void>({ default: null });
}

@Options({
    components: {
        DialogPanel,
        Checkbox
    }
})
export default class DeleteTaskDialog extends Vue.with(DeleteTaskDialogProp) {
    public keepChildren = false;

    get showCheckbox(): boolean {
        return !this.data.parent && !this.data.isInterruption;
    }

    public onConfirm(): void {
        this.confirmHook(this.keepChildren);
    }
}
</script>

<style lang="scss" scoped>
.content {
    display: flex;
    align-items: center;
    height: 1rem;
    font-size: 0.45rem;
    opacity: 0;
    animation: revealContent 0.2s ease 0.5s forwards;

    span {
        filter: brightness(0.85);
        transition: filter 0.2s;

        &:hover {
            cursor: pointer;
            filter: brightness(1);
        }
    }

    .checkbox {
        margin-right: 0.2rem;
        width: 0.525rem;
        height: 0.525rem;
    }
}
</style>
