<template>
    <div class="task-manager-container">
        <item-list-panel class="item-list-panel">
            <task-summary-card class="summary-card"
                v-for="task of tasks"
                :key="task.id"
                :task="task">
            </task-summary-card>
        </item-list-panel>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../store';
import { taskItemKey } from '../../store/task-item/task-item.state';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
import ItemListPanel from '../../shared/panels/ItemListPanel.vue';
import TaskSummaryCard from '../../shared/cards/TaskSummaryCard.vue';

@Options({
    components: {
        ItemListPanel,
        TaskSummaryCard
    }
})
export default class TaskManager extends Vue {

    get tasks(): TaskItem[] {
        return store.getters[`${taskItemKey}/incompleteParentTasks`];
    }
}
</script>

<style lang="scss" scoped>
.task-manager-container {

    .item-list-panel {
        width: 37.5%;
        height: 95%;

        .summary-card {
            width: 100%;
            height: 12.5vh;

            &:not(:nth-last-child(1)) {
                margin-bottom: 1vh;
            }
        }
    }
}
</style>
