<template>
    <div v-if="task" class="subtask-summary-card-container">
        <span>{{ task.name }}</span>
        <estimation-skulls class="estimation-skulls" :estimation="task.estimate"></estimation-skulls>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
import EstimationSkulls from '../../shared/widgets/EstimationSkulls.vue';

class SubtaskSummaryCardProp {
    public task = prop<TaskItem>({ default: null });
}

@Options({
    components: {
        EstimationSkulls
    }
})
export default class SubtaskSummaryCard extends Vue.with(SubtaskSummaryCardProp) { }
</script>

<style lang="scss" scoped>
.subtask-summary-card-container {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 0 5%;
    max-height: 7.5vh;
    background-color: rgba(36, 35, 38, 0.8);

    .estimation-skulls {
        margin-left: auto;
        width: 15%;
        height: 85%;
    }
}
</style>
