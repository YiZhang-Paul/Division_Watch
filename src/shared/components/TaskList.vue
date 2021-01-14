<template>
    <div class="active-indicator" v-if="isActive">
        <div></div>
    </div>

    <input-panel class="list-button"
        :class="$attrs.class"
        :hasAnimation="false"
        @click="$emit('activate')">

        <div class="list-button-content" :class="{ 'active-content': isActive }">
            <component :is="action.icon" class="icon" :style="{ color: action.color }"></component>
            <span>{{ action.name }}</span>
            <span v-if="tasks.length">x{{ tasks.length }}</span>
            <plus class="add-button" />
        </div>
    </input-panel>

    <div class="summary-cards" :class="{ 'active-cards': isActive }">
        <task-summary-card v-for="task of tasks"
            class="summary-card"
            :key="task.name"
            :task="task"
            @click="$emit('summary:select', task)">
        </task-summary-card>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { Plus } from 'mdue';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item';
import { ActionButton } from '../../core/data-model/action-button';
import TaskSummaryCard from '../cards/TaskSummaryCard.vue';
import InputPanel from '../panels/InputPanel.vue';

class TaskListProp {
    public isActive = prop<boolean>({ default: false });
    public action = prop<ActionButton>({ default: new ActionButton() });
    public tasks = prop<TaskItem[]>({ default: [] });
}

@Options({
    components: {
        Plus,
        TaskSummaryCard,
        InputPanel
    },
    emits: [
        'activate',
        'summary:select'
    ]
})
export default class TaskList extends Vue.with(TaskListProp) { }
</script>

<style lang="scss" scoped>
.active-indicator {
    position: relative;
    margin-top: 0;
    width: 100%;
    height: 0;
    animation: expandIndicatorVertical 0.2s ease forwards;

    div {
        position: absolute;
        left: 42.5%;
        width: 15%;
        height: 100%;
        background-color: rgb(246, 149, 78);
        filter: brightness(1);
        opacity: 0;
        animation: expandIndicatorHorizontal 0.25s ease 0.1s forwards;
    }
}

.list-button {

    .list-button-content {
        $padding-side: 0.75em;

        display: flex;
        align-items: center;
        padding: 0 $padding-side;
        width: calc(100% - #{$padding-side} * 2);
        height: 100%;
        background-color: rgba(63, 62, 68, 0.6);
        color: rgba(255, 255, 255, 0.5);
        font-size: 1.25em;
        transition: color 0.3s, filter 0.3s, background-color 0.2s;

        span {
            margin-left: 0.5em;
        }

        .icon, .add-button {
            font-size: 1.4em;
            filter: brightness(0.7);
        }

        .add-button {
            margin-left: auto;
            color: rgb(246, 149, 78);
            opacity: 0;
            transition: filter 0.3s, opacity 0.3s;

            &:hover {
                filter: brightness(1);
            }
        }
    }

    .list-button-content:hover, .active-content {
        cursor: pointer;
        background-color: rgb(63, 62, 68);
        color: rgb(255, 255, 255);

        .icon {
            filter: brightness(1);
        }
    }

    .list-button-content:hover .add-button {
        opacity: 1;
    }
}

.summary-cards {
    flex: 0;
    width: 100%;
    overflow-y: auto;
    transition: flex 0.4s;

    .summary-card {
        width: 100%;
        height: 10%;
        max-height: 55px;
        margin-bottom: 1px;
        opacity: 0;
    }
}

.active-cards {
    flex: 1;

    .summary-card {
        animation: revealContent 0.3s ease 0.4s forwards;
    }
}

@keyframes expandIndicatorVertical {
    from {
        margin-top: 0;
        height: 0;
    }
    to {
        margin-top: 2px;
        height: 0.25em;
    }
}

@keyframes expandIndicatorHorizontal {
    0% {
        left: 42.5%;
        width: 15%;
        opacity: 0;
    }
    1% {
        opacity: 1;
    }
    100% {
        left: 0;
        width: 100%;
        opacity: 1;
    }
}
</style>
