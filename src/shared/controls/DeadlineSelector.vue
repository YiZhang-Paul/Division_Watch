<template>
    <div class="deadline-selector-container">
        <date-selector class="selector" :name="deadlineName"></date-selector>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import DateSelector from '../../shared/controls/DateSelector.vue';
import DaySelector from '../../shared/controls/DaySelector.vue';

class DeadlineSelectorProp {
    public deadlineName = prop<string>({ default: '' });
    public recurName = prop<string>({ default: '' });
    public allowRecur = prop<boolean>({ default: true });
}

@Options({
    components: {
        DateSelector,
        DaySelector
    }
})
export default class DeadlineSelector extends Vue.with(DeadlineSelectorProp) {

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
