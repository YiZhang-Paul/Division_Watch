<template>
    <div class="deadline-selector-container">
        <div class="basic-selectors">
            <date-selector v-if="!isRecurMode"
                class="selector"
                :name="deadlineName"
                :modelValue="cachedDeadline"
                @update:modelValue="onDeadlineChange($event)">
            </date-selector>

            <day-selector v-if="isRecurMode"
                class="selector"
                :name="recurName"
                :days="cachedRecur"
                :delay="100"
                @days:select="onRecurChange($event)">
            </day-selector>

            <menu-button v-if="allowRecur" class="toggle-button" @click="toggleSelection()">
                {{ isRecurMode ? 'to deadline' : 'to recur' }}
            </menu-button>
        </div>

        <time-selector v-if="showTime"
            class="time-selector selector"
            :name="dueTimeName"
            :modelValue="dueTime"
            @update:modelValue="onDueTimeChange($event)">
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
    public isRecur = prop<boolean>({ default: false });
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
    public isRecurMode = this.isRecur;
    private cachedDeadline: Date | null = this.deadline ? new Date(this.deadline) : null;
    private cachedRecur: boolean[] = this.recur?.slice() ?? new Array(7).fill(false);
    private cachedDueTime: string | null = this.dueTime;

    get showTime(): boolean {
        return this.isRecurMode ? this.cachedRecur.some(_ => _) : Boolean(this.cachedDeadline);
    }

    public toggleSelection(): void {
        this.isRecurMode = !this.isRecurMode;

        if (this.isRecurMode) {
            this.$emit('update:deadline', null);
            this.$emit('update:recur', this.cachedRecur);
        }
        else {
            this.$emit('update:recur', new Array(7).fill(false));
            this.$emit('update:deadline', this.cachedDeadline);
        }

        this.adjustTime();
    }

    public onDeadlineChange(deadline: Date | null): void {
        this.cachedDeadline = deadline;
        this.$emit('update:deadline', deadline);
        this.adjustTime();
    }

    public onRecurChange(recur: boolean[]): void {
        this.cachedRecur = recur.slice();
        this.$emit('update:recur', recur);
        this.adjustTime();
    }

    public onDueTimeChange(time: string): void {
        this.cachedDueTime = time;
        this.$emit('update:time', time);
    }

    private adjustTime(): void {
        if (this.showTime) {
            this.$emit('update:time', this.cachedDueTime);
        }
        else {
            this.cachedDueTime = this.dueTime;
            this.$emit('update:time', null);
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
        z-index: 1;
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
        z-index: 0;
        margin-top: 1%;
    }
}
</style>
