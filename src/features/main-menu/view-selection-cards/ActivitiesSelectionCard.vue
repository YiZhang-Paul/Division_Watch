<template>
    <div class="activities-selection-card-container">
        <span class="title">Activities</span>
        <span class="message">tasks & interruptions</span>

        <span class="task-count">
            <span>{{ tasks }}&nbsp;</span>
            <span>task{{ tasks > 1 ? 's' : '' }}</span>
        </span>

        <span class="interruption-count">
            <span>{{ interruptions }}&nbsp;</span>
            <span>interruption{{ interruptions > 1 ? 's' : '' }}</span>
        </span>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

import store from '../../../store';
import { taskItemKey } from '../../../store/task-item/task-item.state';

export default class ActivitiesSelectionCard extends Vue {

    get tasks(): number {
        return store.getters[`${taskItemKey}/incompleteParentTasks`]?.length ?? 0;
    }

    get interruptions(): number {
        return store.getters[`${taskItemKey}/incompleteInterruptions`]?.length ?? 0;
    }
}
</script>

<style lang="scss" scoped>
.activities-selection-card-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    font-size: 0.8rem;

    .title {
        font-size: 2rem;
    }

    .message {
        color: rgb(215, 215, 215);
    }

    .task-count span:last-of-type {
        color: rgb(246, 39, 226);
    }

    .interruption-count span:last-of-type {
        color: rgb(83, 191, 252);
    }
}
</style>
