<template>
    <div v-if="item" class="checklist-card-container">
        <radiobox-blank v-if="!item.isCompleted" class="incomplete-icon" />
        <check v-if="item.isCompleted" class="complete-icon" />

        <span v-if="!isEditing" :class="{ completed: item.isCompleted }" @click="onEditStart()">
            {{ item.description }}
        </span>

        <input type="text"
            v-if="isEditing"
            ref="descriptionInput"
            v-model="description"
            @keyup.enter="onEditConfirm()"
            @keyup.esc="isEditing = false"
            @blur="isEditing = false" />

        <checkbox class="checkbox" :isChecked="item.isCompleted" @change="onCheckedChange($event)"></checkbox>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { Check, RadioboxBlank } from 'mdue';
// eslint-disable-next-line no-unused-vars
import { ChecklistItem } from '../../core/data-model/task-item/checklist-item';
import Checkbox from '../../shared/controls/Checkbox.vue';

class ChecklistCardProp {
    public item = prop<ChecklistItem>({ default: null });
}

@Options({
    components: {
        Check,
        RadioboxBlank,
        Checkbox
    },
    emits: ['change']
})
export default class ChecklistCard extends Vue.with(ChecklistCardProp) {
    public description = this.item?.description ?? '';
    public isEditing = false;

    public onEditStart(): void {
        this.isEditing = true;
        setTimeout(() => (this.$refs.descriptionInput as any).focus());
    }

    public onEditConfirm(): void {
        this.isEditing = false;
        this.$emit('change', { ...this.item, description: this.description });
    }

    public onCheckedChange(value: boolean): void {
        this.$emit('change', { ...this.item, isCompleted: value });
    }
}
</script>

<style lang="scss" scoped>
.checklist-card-container {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding-left: 2.5%;
    padding-right: 5%;
    max-height: 7.5vh;
    background-color: rgba(36, 35, 38, 0.8);
    color: rgb(255, 255, 255);
    transition: background-color 0.3s;

    &:hover {
        cursor: pointer;
        background-color: rgb(72, 66, 110);
    }

    .incomplete-icon, .complete-icon {
        font-size: 0.75rem;
        opacity: 0;
        animation: revealContent 0.4s ease 0.1s forwards;
    }

    .incomplete-icon {
        color: rgb(250, 255, 14);
    }

    .complete-icon {
        color: rgb(29, 255, 51);
    }

    & > span, & > input {
        padding: 3px;
        margin-left: 2.25%;
        font-size: 0.5rem;
        font-family: 'Jost';
        width: 67.5%;
        max-width: 67.5%;
    }

    & > span {
        transition: filter 0.3s;

        &.completed {
            filter: brightness(0.6);
        }
    }

    & > input {
        outline: none;
        border: none;
        background-color: rgba(11, 11, 12, 0.8);
        color: rgb(255, 255, 255);
    }

    .checkbox {
        margin-left: auto;
        width: 0.6rem;
        height: 0.6rem;
    }
}
</style>
