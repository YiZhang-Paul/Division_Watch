<template>
    <div class="item-inspector-title-container" :style="containerStyle">
        <div class="priority-indicator"></div>

        <div class="title-text">
            <span>{{ item.name }}</span>
            <span class="priority-text">{{ priorityText }}</span>

            <div class="sessions">
                <span>SESSIONS</span>
                <span v-if="!sessions" class="session-text-small">&#60;1</span>

                <counter-display v-if="sessions"
                    class="session-text"
                    :value="sessions"
                    :digits="2">
                </counter-display>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import store from '../../../store';
import { taskItemKey } from '../../../store/task-item/task-item.state';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../../core/data-model/task-item/task-item';
// eslint-disable-next-line no-unused-vars
import { TaskItemOptions } from '../../../core/data-model/task-item/task-item-options';
import CounterDisplay from '../../../shared/widgets/CounterDisplay.vue';
import { GenericUtility } from '../../../core/utilities/generic/generic.utility';
import { TimeUtility } from '../../../core/utilities/time/time.utility';

class ItemInspectorTitleProp {
    public item = prop<TaskItem>({ default: null });
}

@Options({
    components: {
        CounterDisplay
    }
})
export default class ItemInspectorTitle extends Vue.with(ItemInspectorTitleProp) {

    get containerStyle(): { [key: string]: string } {
        const { rank } = this.item.priority;

        return {
            '--priority-color': GenericUtility.getPriorityColor(rank),
            '--priority-color-alpha': GenericUtility.getPriorityColor(rank, 0.45),
            '--priority-label-color': rank === 2 ? 'rgb(253, 162, 162)' : GenericUtility.getPriorityColor(rank)
        };
    }

    get priorityText(): string {
        if (!this.item.priority.rank) {
            return 'Non-critical Item';
        }

        return this.item.priority.rank === 1 ? 'Normal Priority' : 'High Value Target';
    }

    get sessions(): number {
        const options = store.getters[`${taskItemKey}/taskItemOptions`] as TaskItemOptions;

        return TimeUtility.getTotalSessions(this.item.estimate, options);
    }
}
</script>

<style lang="scss" scoped>
.item-inspector-title-container {
    display: flex;
    background: linear-gradient(to right, var(--priority-color-alpha) 0.1%, transparent 70%);

    .priority-indicator {
        width: 5%;
        height: 100%;
        background-color: var(--priority-color);
    }

    .title-text {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        padding: 2% 4%;
        width: 95%;
        height: 100%;
        background-color: transparent;
        color: rgb(255, 255, 255);
        font-size: 0.55rem;

        .priority-text {
            color: var(--priority-label-color);
        }

        .sessions {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: absolute;
            right: 3.5%;
            font-size: 0.45rem;
            line-height: 0.45rem;

            .session-text, .session-text-small {
                font-size: 1.2rem;
                line-height: 0.9rem;
            }

            .session-text-small {
                font-family: 'Play';
            }
        }
    }
}
</style>
