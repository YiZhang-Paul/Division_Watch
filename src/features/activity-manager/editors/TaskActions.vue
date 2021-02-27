<template>
    <div v-if="task" class="task-actions-container">
        <template v-if="!task.id">
            <menu-button v-if="!isActionLocked"
                class="action-button cancel-button"
                @click="cancelCreate(task.isInterruption)">

                Cancel
            </menu-button>

            <menu-button class="action-button"
                :isDisabled="isActionLocked"
                @click="createTaskItem(task)">

                Create
            </menu-button>
        </template>

        <menu-button v-if="task.id && task.isInterruption"
            :isDisabled="isActionLocked"
            class="action-button"
            @click="convertToTask(task)">

            Convert to Task
        </menu-button>

        <menu-button v-if="task.parent"
            :isDisabled="isActionLocked"
            class="action-button"
            @click="convertToParent(task)">

            Convert to Parent
        </menu-button>

        <menu-button v-if="task.id"
            :isDisabled="isActionLocked"
            class="action-button warning-button"
            @click="deleteTaskItem(task)">

            Delete
        </menu-button>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import store from '../../../store';
import { soundKey } from '../../../store/sound/sound.state';
import { dialogKey } from '../../../store/dialog/dialog.state';
import { taskItemKey } from '../../../store/task-item/task-item.state';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../../core/data-model/task-item/task-item';
import { SoundOption } from '../../../core/data-model/generic/sound-option';
import { DialogOption } from '../../../core/data-model/generic/dialog-option';
import MenuButton from '../../../shared/controls/MenuButton.vue';
import { SoundType } from '../../../core/enums/sound-type.enum';

class TaskActionsProp {
    public task = prop<TaskItem>({ default: null });
}

@Options({
    components: {
        MenuButton
    }
})
export default class TaskActions extends Vue.with(TaskActionsProp) {
    public isActionLocked = false;

    public createTaskItem(item: TaskItem): void {
        this.execute(async() => {
            if (!item.name?.trim()) {
                const title = 'Invalid transmission detected:';
                const errors = ['name must be non-empty.'];
                const option = new DialogOption(title, 'Got it', '', '', null, errors, true);
                store.dispatch(`${dialogKey}/openDialog`, option);

                return;
            }

            const result: TaskItem = await store.dispatch(`${taskItemKey}/addParentTaskItem`, item);

            if (result) {
                const action = result.isInterruption ? 'swapActiveInterruption' : 'swapActiveItem';
                store.dispatch(`${taskItemKey}/${action}`, result);
                store.dispatch(`${soundKey}/playSound`, new SoundOption('item_add', SoundType.UI));
            }
        });
    }

    public cancelCreate(isInterruption: boolean): void {
        this.execute(() => {
            const action = isInterruption ? 'swapActiveInterruption' : 'swapActiveItem';
            store.dispatch(`${taskItemKey}/${action}`, null);
        });
    }

    public convertToTask(item: TaskItem): void {
        const title = 'This interruption will be converted to a task.';
        const option = new DialogOption(title, 'Convert', 'Cancel');

        option.confirmCallback = () => {
            this.execute(async() => await store.dispatch(`${taskItemKey}/convertInterruption`, item));
        };

        store.dispatch(`${dialogKey}/openDialog`, option);
    }

    public convertToParent(item: TaskItem): void {
        const title = 'This task will be converted to a parent task.';
        const option = new DialogOption(title, 'Convert', 'Cancel');

        option.confirmCallback = () => {
            this.execute(async() => await store.dispatch(`${taskItemKey}/convertChildTask`, item));
        };

        store.dispatch(`${dialogKey}/openDialog`, option);
    }

    public deleteTaskItem(item: TaskItem): void {
        const title = 'This item will be permanently deleted.';
        const checkboxText = item.parent || item.isInterruption ? '' : 'do not remove child tasks';
        const option = new DialogOption(title, 'Delete', 'Cancel', checkboxText, null, [], true);

        option.confirmCallback = (keepChildren: boolean) => {
            this.execute(async() => await store.dispatch(`${taskItemKey}/deleteTaskItem`, { item, keepChildren }));
        };

        store.dispatch(`${dialogKey}/openDialog`, option);
    }

    private async execute(callback: (...args: any[]) => any): Promise<void> {
        if (!this.isActionLocked) {
            this.isActionLocked = true;
            await callback();
            this.isActionLocked = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.task-actions-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .action-button {
        padding-left: 0.65rem;
        padding-right: 0.65rem;
        height: 3.5vh;
        background-color: rgb(59, 163, 154);
        color: rgb(255, 255, 255);
        opacity: 0;
        animation: revealContent 0.25s ease 0.6s forwards;

        &:hover {
            background-color: rgb(75, 192, 182);
        }

        &:not(:nth-child(1)) {
            margin-left: 7%;
        }

        &.cancel-button {
            background-color: rgba(140, 140, 140, 0.25);

            &:hover {
                background-color: rgba(175, 175, 175, 0.35);
            }
        }

        &.warning-button {
            background-color: rgb(236, 33, 18);

            &:hover {
                background-color: rgb(238, 61, 49);
            }
        }
    }
}
</style>
