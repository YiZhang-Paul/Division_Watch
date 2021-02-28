<template>
    <div v-if="item" class="checklist-card-container">
        <div class="status-toggle"
            :class="{ 'glowing-toggle': isGlowing }"
            @click="onCheckedChange()"
            @mouseover="isGlowing = true"
            @mouseout="isGlowing = false">

            <radiobox-blank v-if="!item.isCompleted" class="incomplete-icon" />
            <check v-if="item.isCompleted" class="complete-icon" />
        </div>

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

        <delete class="delete-button" @click="$emit('delete')" />
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { Check, Delete, RadioboxBlank } from 'mdue';
// eslint-disable-next-line no-unused-vars
import { ChecklistItem } from '../../core/data-model/task-item/checklist-item';

class ChecklistCardProp {
    public item = prop<ChecklistItem>({ default: null });
}

@Options({
    components: {
        Check,
        Delete,
        RadioboxBlank
    },
    emits: [
        'change',
        'delete'
    ]
})
export default class ChecklistCard extends Vue.with(ChecklistCardProp) {
    public description = this.item?.description ?? '';
    public isGlowing = false;
    public isEditing = false;

    public onEditStart(): void {
        this.isEditing = true;
        setTimeout(() => (this.$refs.descriptionInput as any).focus());
    }

    public onEditConfirm(): void {
        this.isEditing = false;
        this.$emit('change', { ...this.item, description: this.description });
    }

    public onCheckedChange(): void {
        this.$emit('change', { ...this.item, isCompleted: !this.item.isCompleted });
    }
}
</script>

<style lang="scss" scoped>
.checklist-card-container {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding-left: 2.75%;
    padding-right: 4%;
    max-height: 7.5vh;
    background-color: rgba(36, 35, 38, 0.6);
    color: rgb(255, 255, 255);
    transition: background-color 0.3s;

    &:hover {
        cursor: pointer;
        background-color: rgba(60, 60, 60, 0.5);

        & > span {
            width: 73.5%;
            max-width: 73.5%;
        }

        .delete-button {
            display: initial;
        }
    }

    .status-toggle {
        display: flex;
        justify-content: center;
        align-items: center;

        &.glowing-toggle .incomplete-icon, &.glowing-toggle .complete-icon {
            animation: revealContent 0.4s ease 0.1s forwards,
                       glowToggle 1s ease infinite;
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
    }

    & > span, & > input {
        padding: 3px;
        margin-left: 2.25%;
        width: 73.5%;
        max-width: 73.5%;
        font-size: 0.5rem;
        font-family: 'Jost';
        opacity: 0;
        animation: revealContent 0.1s ease forwards;
    }

    & > span {
        width: calc(100% - 1.05rem);
        max-width: calc(100% - 1.05rem);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        transition: filter 0.3s, background-color 0.3s 0.05s;

        &:hover {
            background-color: rgba(58, 56, 61, 0.5);
        }

        &.completed {
            filter: brightness(0.6);
        }
    }

    & > input {
        outline: none;
        border: none;
        background-color: rgba(11, 11, 12, 0.5);
        color: rgb(255, 255, 255);
    }

    .delete-button {
        display: none;
        margin-left: auto;
        font-size: 0.75rem;
        opacity: 0;
        transition: color 0.3s;
        animation: revealContent 0.35s ease 0.1s forwards;

        &:hover {
            color: rgb(243, 58, 45);
        }
    }

    @keyframes glowToggle {
        0% {
            color: rgb(74, 236, 223);
        }
        50% {
            color: rgb(200, 200, 200);
        }
        100% {
            color: rgb(74, 236, 223);
        }
    }
}
</style>
