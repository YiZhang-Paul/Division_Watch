<template>
    <dialog-panel :title="'All subtasks below will be registered:'"
        :confirmText="'Register'"
        :confirmHook="confirmHook">

        <div class="content">
            <overlay-scrollbar-panel class="overlay-scrollbar-panel">
                <div class="list-wrapper">
                    <compact-task-summary-card v-for="task of data"
                        class="summary-card"
                        :key="task.id"
                        :task="task"
                        :isReadonly="true">
                    </compact-task-summary-card>
                </div>
            </overlay-scrollbar-panel>
        </div>
    </dialog-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
import CompactTaskSummaryCard from '../../shared/cards/CompactTaskSummaryCard.vue';
import OverlayScrollbarPanel from '../../shared/panels/OverlayScrollbarPanel.vue';
import DialogPanel from '../../shared/panels/DialogPanel.vue';

class RegisterParentDialogProp {
    public data = prop<TaskItem[]>({ default: [] });
    public confirmHook = prop<(...args: any[]) => void>({ default: null });
}

@Options({
    components: {
        CompactTaskSummaryCard,
        OverlayScrollbarPanel,
        DialogPanel
    }
})
export default class RegisterParentDialog extends Vue.with(RegisterParentDialogProp) { }
</script>

<style lang="scss" scoped>
.content {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.275rem 0;
    width: 100%;
    opacity: 0;
    animation: revealContent 0.2s ease 0.5s forwards;

    .overlay-scrollbar-panel {
        width: 80%;
        height: 90%;
        max-height: 30vh;

        .list-wrapper {
            width: 100%;
            height: 100%;

            .summary-card {
                width: 100%;
                height: 4.5vh;

                &:not(:nth-last-child(1)) {
                    margin-bottom: 0.75%;
                }
            }
        }
    }
}
</style>
