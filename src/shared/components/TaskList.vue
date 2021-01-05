<template>
    <glass-panel class="task-list-container">
        <div class="task-list-content">
            <div class="active-indicator" v-if="activeNode === 'task'">
                <div></div>
            </div>

            <input-panel class="task-node" @click="activeNode = 'task'">
                <div class="node-content" :class="{ 'active-node': activeNode === 'task' }">
                    <timer-sand class="icon" />
                    <span>Tasks</span>
                    <span>x{{ tasks.length }}</span>
                    <plus class="add-button" />
                </div>
            </input-panel>

            <div class="task-node-items" :class="{ 'active-list': activeNode === 'task' }">
                <task-summary-card v-for="task of tasks"
                    class="summary-card"
                    :key="task.name"
                    :task="task">
                </task-summary-card>
            </div>

            <div class="active-indicator" v-if="activeNode === 'interruption'">
                <div></div>
            </div>

            <input-panel class="interruption-node" @click="activeNode = 'interruption'">
                <div class="node-content" :class="{ 'active-node': activeNode === 'interruption' }">
                    <exclamation-thick class="icon" />
                    <span>Interruptions</span>
                    <span>x{{ interruptions.length }}</span>
                    <plus class="add-button" />
                </div>
            </input-panel>

            <div class="interruption-node-items" :class="{ 'active-list': activeNode === 'interruption' }">
                <task-summary-card v-for="interruption of interruptions"
                    class="summary-card"
                    :key="interruption.name"
                    :task="interruption">
                </task-summary-card>
            </div>

            <div class="active-indicator" v-if="activeNode === 'category'">
                <div></div>
            </div>

            <input-panel class="category-node" @click="activeNode = 'category'">
                <div class="node-content" :class="{ 'active-node': activeNode === 'category' }">
                    <format-list-bulleted-type class="icon" />
                    <span>Categories</span>
                    <plus class="add-button" />
                </div>
            </input-panel>

            <div class="category-node-items" :class="{ 'active-list': activeNode === 'category' }"></div>
        </div>
    </glass-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { ExclamationThick, FormatListBulletedType, Plus, TimerSand } from 'mdue';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item';
import { TaskItemHttpService } from '../../core/services/http/task-item-http/task-item-http.service';
import TaskSummaryCard from '../../shared/cards/TaskSummaryCard.vue';
import InputPanel from '../../shared/panels/InputPanel.vue';
import GlassPanel from '../../shared/panels/GlassPanel.vue';

const taskItemHttpService = new TaskItemHttpService();

@Options({
    components: {
        ExclamationThick,
        FormatListBulletedType,
        Plus,
        TimerSand,
        TaskSummaryCard,
        InputPanel,
        GlassPanel
    }
})
export default class TaskList extends Vue {
    public activeNode = 'task';
    public tasks: TaskItem[] = [];
    public interruptions: TaskItem[] = [];

    public async created(): Promise<void> {
        const items = await taskItemHttpService.getTaskItems();
        this.tasks = items.filter(_ => !_.isInterruption);
        this.interruptions = items.filter(_ => _.isInterruption);
    }
}
</script>

<style lang="scss" scoped>
.task-list-container {

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

    .task-list-content {
        display: flex;
        flex-direction: column;
        padding-top: 5px;
        width: 100%;
        height: calc(100% - 5px);
    }

    .task-node-items,
    .interruption-node-items,
    .category-node-items {
        width: 100%;
        flex: 0;
        overflow-y: auto;
        transition: flex 0.4s;
    }

    .summary-card {
        width: 100%;
        height: 8%;
        max-height: 45px;
        margin-bottom: 1px;
        opacity: 0;
    }

    .active-list {
        flex: 1;

        .summary-card {
            animation: revealSummary 0.3s ease 0.4s forwards;
        }
    }

    .task-node,
    .interruption-node,
    .category-node {
        margin-top: 2px;
        width: 100%;
        height: 7%;
        max-height: 50px;

        .node-content {
            display: flex;
            align-items: center;
            padding: 0 0.75em;
            width: calc(100% - 1.5em);
            height: 100%;
            background-color: rgba(63, 62, 68, 0.6);
            color: rgba(255, 255, 255, 0.5);
            font-family: 'Segoe UI';
            font-size: 1.25em;
            transition: color 0.3s, filter 0.3s, background-color 0.2s;

            span {
                margin-left: 0.5em;
            }
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

        .active-node {
            background-color: rgb(63, 62, 68);
            color: rgb(255, 255, 255);

            .icon {
                filter: brightness(1);
            }
        }

        &:hover {
            cursor: pointer;

            .node-content {
                background-color: rgb(63, 62, 68);
                color: rgb(255, 255, 255);
            }

            .icon {
                filter: brightness(1);
            }

            .add-button {
                opacity: 1;
            }
        }
    }

    .task-node .icon {
        color: rgb(255, 28, 82);
    }

    .interruption-node .icon {
        color: rgb(0, 117, 255);
    }

    .category-node .icon {
        color: rgb(245, 238, 58);
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

    @keyframes revealSummary {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
}
</style>
