<template>
    <div class="deadline-selector-container">
        <date-selector v-if="!isRecur"
            class="selector"
            :name="deadlineName"
            :modelValue="currentDeadline"
            @update:modelValue="$emit('update:deadline', $event)">
        </date-selector>

        <day-selector v-if="isRecur"
            class="selector"
            :name="recurName"
            :days="currentRecur"
            :delay="100"
            @days:select="$emit('update:recur', $event)">
        </day-selector>

        <menu-button v-if="allowRecur" class="toggle-button" @click="toggleSelection()">
            {{ isRecur ? 'to deadline' : 'to recur' }}
        </menu-button>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import MenuButton from '../../shared/controls/MenuButton.vue';
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
        MenuButton,
        DateSelector,
        DaySelector
    },
    emits: [
        'update:deadline',
        'update:recur'
    ]
})
export default class DeadlineSelector extends Vue.with(DeadlineSelectorProp) {
    public isRecur = false;
    private cachedDeadline: Date | null = this.currentDeadline;
    private cachedRecur: boolean[] = this.currentRecur;

    get currentDeadline(): Date | null {
        return this.deadline ? new Date(this.deadline) : null;
    }

    get currentRecur(): boolean[] {
        return this.recur?.slice() ?? new Array(7).fill(false);
    }

    public toggleSelection(): void {
        this.isRecur = !this.isRecur;

        if (this.isRecur) {
            this.cachedDeadline = this.currentDeadline;
            this.$emit('update:deadline', null);
            this.$emit('update:recur', this.cachedRecur);
        }
        else {
            this.cachedRecur = this.currentRecur;
            this.$emit('update:recur', new Array(7).fill(false));
            this.$emit('update:deadline', this.cachedDeadline);
        }
    }
}
</script>

<style lang="scss" scoped>
.deadline-selector-container {
    display: flex;
    align-items: center;
    position: relative;

    .selector {
        width: 100%;
        height: 100%;
    }

    .toggle-button {
        position: absolute;
        left: 25%;
        width: 15%;
        background-color: rgb(240, 123, 14);
        font-size: 0.45rem;
    }
}
</style>
