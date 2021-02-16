<template>
    <div class="deadline-selector-container">
        <date-selector class="selector"
            :name="deadlineName"
            :modelValue="currentDeadline"
            @update:modelValue="$emit('update:deadline', $event)">
        </date-selector>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import DateSelector from '../../shared/controls/DateSelector.vue';
import DaySelector from '../../shared/controls/DaySelector.vue';

class DeadlineSelectorProp {
    public deadlineName = prop<string>({ default: '' });
    public deadline = prop<Date>({ default: new Date() });
    public recurName = prop<string>({ default: '' });
    public recur = prop<boolean[]>({ default: new Array(7).fill(false) });
    public allowRecur = prop<boolean>({ default: true });
}

@Options({
    components: {
        DateSelector,
        DaySelector
    },
    emits: [
        'update:deadline',
        'update:recur'
    ]
})
export default class DeadlineSelector extends Vue.with(DeadlineSelectorProp) {

    get currentDeadline(): Date {
        return this.deadline ? new Date(this.deadline) : new Date();
    }
}
</script>

<style lang="scss" scoped>
.deadline-selector-container {

    .selector {
        width: 100%;
        height: 100%;
    }
}
</style>
