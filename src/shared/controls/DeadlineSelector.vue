<template>
    <div class="deadline-selector-container">
        <div class="basic-selectors">
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

        <time-selector v-if="showTime"
            class="time-selector selector"
            :name="dueTimeName"
            :modelValue="dueTime"
            @update:modelValue="$emit('update:time', $event)">
        </time-selector>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import MenuButton from '../../shared/controls/MenuButton.vue';
import DateSelector from '../../shared/controls/DateSelector.vue';
import DaySelector from '../../shared/controls/DaySelector.vue';
import TimeSelector from '../../shared/controls/TimeSelector.vue';

class DeadlineSelectorProp {
    public deadlineName = prop<string>({ default: '' });
    public deadline = prop<Date>({ default: new Date() });
    public recurName = prop<string>({ default: '' });
    public recur = prop<boolean[]>({ default: new Array(7).fill(false) });
    public dueTimeName = prop<string>({ default: '' });
    public dueTime = prop<string>({ default: '' });
    public allowRecur = prop<boolean>({ default: true });
}

@Options({
    components: {
        MenuButton,
        DateSelector,
        DaySelector,
        TimeSelector
    },
    emits: [
        'update:deadline',
        'update:recur',
        'update:time'
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

    get showTime(): boolean {
        return this.isRecur ? this.currentRecur.some(_ => _) : Boolean(this.currentDeadline);
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
    flex-direction: column;
    align-items: center;

    .basic-selectors {
        display: flex;
        align-items: center;
        position: relative;
        width: 100%;
        height: 100%;

        .toggle-button {
            position: absolute;
            left: 25%;
            width: 15%;
            height: 65%;
            background-color: rgb(240, 123, 14);
            font-size: 0.45rem;

            &:hover {
                background-color: rgb(241, 147, 58);
            }
        }
    }

    .selector {
        width: 100%;
        height: 100%;
        opacity: 0;
        animation: revealContent 0.3s ease 0.1s forwards;
    }

    .time-selector {
        margin-top: 1%;
    }
}
</style>
