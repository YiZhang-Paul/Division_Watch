<template>
    <div v-if="task"
        class="subtask-summary-card-container"
        @mouseover="isMouseover = true"
        @mouseout="isMouseover = false">

        <priority-indicator class="priority-indicator" :priority="task.priority.rank" :isGlowing="isMouseover"></priority-indicator>
        <span>{{ task.name }}</span>
        <delete class="delete-button" @click.stop="$emit('delete')" />

        <estimation-skulls v-if="!isMouseover"
            class="estimation-skulls"
            :estimation="task.estimate">
        </estimation-skulls>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { Delete } from 'mdue';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
import PriorityIndicator from '../../shared/widgets/PriorityIndicator.vue';
import EstimationSkulls from '../../shared/widgets/EstimationSkulls.vue';

class SubtaskSummaryCardProp {
    public task = prop<TaskItem>({ default: null });
}

@Options({
    components: {
        Delete,
        PriorityIndicator,
        EstimationSkulls
    },
    emits: ['delete']
})
export default class SubtaskSummaryCard extends Vue.with(SubtaskSummaryCardProp) {
    public isMouseover = false;
}
</script>

<style lang="scss" scoped>
.subtask-summary-card-container {
    $skulls-width: 16.5%;

    box-sizing: border-box;
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 2%;
    padding-right: 4%;
    max-height: 7.5vh;
    background-color: rgba(36, 35, 38, 0.6);
    transition: background-color 0.3s;

    &:hover {
        cursor: pointer;
        background-color: rgba(60, 60, 60, 0.5);

        .delete-button {
            display: initial;
        }
    }

    .priority-indicator {
        height: 80%;
    }

    & > span {
        margin-left: 1%;
        width: calc(100% - #{$skulls-width} - 1.25rem);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .delete-button, .estimation-skulls {
        opacity: 0;
        animation: revealContent 0.35s ease 0.1s forwards;
    }

    .delete-button {
        display: none;
        position: absolute;
        right: 4%;
        font-size: 0.75rem;
        transition: color 0.3s;

        &:hover {
            color: rgb(243, 58, 45);
        }
    }

    .estimation-skulls {
        margin-left: auto;
        width: $skulls-width;
        height: 85%;
    }
}
</style>
