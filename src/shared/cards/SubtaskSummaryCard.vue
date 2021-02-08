<template>
    <div v-if="task"
        class="subtask-summary-card-container"
        @mouseover="isMouseover = true"
        @mouseout="isMouseover = false">

        <priority-indicator :priority="task.priority.rank" :isGlowing="isMouseover"></priority-indicator>
        <span>{{ task.name }}</span>
        <estimation-skulls class="estimation-skulls" :estimation="task.estimate"></estimation-skulls>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
import PriorityIndicator from '../../shared/widgets/PriorityIndicator.vue';
import EstimationSkulls from '../../shared/widgets/EstimationSkulls.vue';

class SubtaskSummaryCardProp {
    public task = prop<TaskItem>({ default: null });
}

@Options({
    components: {
        PriorityIndicator,
        EstimationSkulls
    }
})
export default class SubtaskSummaryCard extends Vue.with(SubtaskSummaryCardProp) {
    public isMouseover = false;
}
</script>

<style lang="scss" scoped>
.subtask-summary-card-container {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding-left: 2.5%;
    padding-right: 5%;
    max-height: 7.5vh;
    background-color: rgba(36, 35, 38, 0.8);

    &:hover {
        cursor: pointer;
        background-color: rgb(72, 66, 110);
    }

    & > span {
        margin-left: 1%;
    }

    .estimation-skulls {
        margin-left: auto;
        width: 15%;
        height: 85%;
    }
}
</style>
