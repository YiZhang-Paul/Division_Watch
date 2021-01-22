<template>
    <input-panel :delay="0.3">
        <div class="content">
            <span>Danger Zone</span>

            <div class="confirmations">
                <confirm-panel v-if="isInterruption"
                    class="confirmation"
                    ref="conversionConfirm"
                    :displayText="'Convert to Task'"
                    :confirmText="'Convert'"
                    @confirm:start="closeConfirmPanels($refs.conversionConfirm)"
                    @confirm:confirmed="$emit('interruption:convert')">
                </confirm-panel>

                <confirm-panel class="confirmation"
                    ref="deletionConfirm"
                    :isWarning="true"
                    :modifierText="isParent ? 'keep child tasks' : ''"
                    :displayText="'Delete ' + (isInterruption ? 'Interruption' : 'Task')"
                    :confirmText="'Delete'"
                    @confirm:start="closeConfirmPanels($refs.deletionConfirm)"
                    @confirm:confirmed="$emit('task:delete', $event)">
                </confirm-panel>
            </div>
        </div>
    </input-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import InputPanel from '../../shared/panels/InputPanel.vue';
import ConfirmPanel from '../../shared/panels/ConfirmPanel.vue';

class TaskDangerZoneProp {
    public isParent = prop<boolean>({ default: false });
    public isInterruption = prop<boolean>({ default: false });
}

@Options({
    components: {
        InputPanel,
        ConfirmPanel
    },
    emits: [
        'interruption:convert',
        'task:delete'
    ]
})
export default class TaskDangerZone extends Vue.with(TaskDangerZoneProp) {

    public closeConfirmPanels(current: any): void {
        const components = [this.$refs.conversionConfirm, this.$refs.deletionConfirm] as any[];

        for (const component of components) {
            if (component && current !== component) {
                component.isConfirming = false;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.content {
    display: flex;
    align-items: center;
    padding: 1.5% 4%;
    color: rgb(255, 255, 255);
    background-color: rgba(63, 62, 68, 0.6);

    & > span:first-of-type {
        align-self: flex-start;
        margin-top: 0.3rem;
        width: 47.5%;
        color: rgb(230, 23, 23);
        font-family: 'Bruno Ace';
        font-size: 0.475rem;
    }

    .confirmations {
        width: 52.5%;
    }

    .confirmation {
        margin-top: 2%;
    }
}
</style>
