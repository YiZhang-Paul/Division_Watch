<template>
    <view-panel class="activity-manager-container">
        <template v-slot:header>
            <div class="header-content">
                <title-panel>Activities</title-panel>

                <compact-tab-group class="compact-tab-group"
                    :options="tabs"
                    @tab:selected="activeTab = $event">
                </compact-tab-group>
            </div>
        </template>

        <div class="main-content">
            <task-manager v-if="activeTab === 0" class="task-manager"></task-manager>
            <task-manager v-if="activeTab === 1" class="task-manager" :isInterruption="true"></task-manager>
            <category-manager v-if="activeTab === 2" class="category-manager"></category-manager>
        </div>

        <template v-slot:footer>
            <div class="footer-content">
                <menu-button class="back-button" @click="backToMain()">Back</menu-button>
                <menu-button class="close-button" @click="closePanel()">Close</menu-button>

                <div v-if="activeTab < 2 && activeTask" class="item-actions">
                    <menu-button v-if="!activeTask.id"
                        class="action-button"
                        @click="createTaskItem(activeTask)">

                        Create
                    </menu-button>

                    <menu-button v-if="activeTask.id && activeTask.isInterruption"
                        class="action-button"
                        @click="convertToTask(activeTask)">

                        Convert to Task
                    </menu-button>

                    <menu-button v-if="activeTask.parent"
                        class="action-button"
                        @click="convertToParent(activeTask)">

                        Convert to Parent
                    </menu-button>

                    <menu-button v-if="activeTask.id"
                        class="action-button warning-button"
                        @click="deleteTaskItem(activeTask)">

                        Delete
                    </menu-button>
                </div>

                <div v-if="activeTab === 2 && activeCategory" class="item-actions">
                    <menu-button v-if="!activeCategory.id"
                        class="action-button"
                        @click="createCategory(activeCategory)">

                        Create
                    </menu-button>

                    <menu-button v-if="activeCategory.id"
                        class="action-button warning-button"
                        @click="deleteCategory(activeCategory)">

                        Delete
                    </menu-button>
                </div>
            </div>
        </template>
    </view-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { markRaw } from 'vue';
import { Ammunition, Biohazard, Target } from 'mdue';

import store from '../../store';
import { mainViewKey } from '../../store/main-view/main-view.state';
import { dialogKey } from '../../store/dialog/dialog.state';
import { categoryKey } from '../../store/category/category.state';
import { taskItemKey } from '../../store/task-item/task-item.state';
// eslint-disable-next-line no-unused-vars
import { Category } from '../../core/data-model/generic/category';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
import { DialogOption } from '../../core/data-model/generic/dialog-option';
import { DropdownOption } from '../../core/data-model/generic/dropdown-option';
import { TabGroupOption } from '../../core/data-model/generic/tab-group-option';
import TitlePanel from '../../shared/panels/TitlePanel.vue';
import ViewPanel from '../../shared/panels/ViewPanel.vue';
import CompactTabGroup from '../../shared/controls/CompactTabGroup.vue';
import MenuButton from '../../shared/controls/MenuButton.vue';
import { ViewOption } from '../../core/enums/view-option.enum';

import TaskManager from './TaskManager.vue';
import CategoryManager from './CategoryManager.vue';

@Options({
    components: {
        Ammunition,
        Biohazard,
        Target,
        TitlePanel,
        ViewPanel,
        CompactTabGroup,
        MenuButton,
        TaskManager,
        CategoryManager
    }
})
export default class ActivityManager extends Vue {
    public activeTab = 0;

    get tabs(): TabGroupOption[] {
        return [
            markRaw(new TabGroupOption('Tasks', Target, this.tasks)),
            markRaw(new TabGroupOption('Interruptions', Biohazard, this.interruptions)),
            markRaw(new TabGroupOption('Categories', Ammunition, this.categories))
        ]
    }

    get activeTask(): TaskItem | null {
        return store.getters[`${taskItemKey}/${this.activeTab ? 'activeInterruption' : 'activeItem'}`];
    }

    get activeCategory(): Category | null {
        return store.getters[`${categoryKey}/activeCategory`];
    }

    get tasks(): number {
        return store.getters[`${taskItemKey}/incompleteParentTasks`].length;
    }

    get interruptions(): number {
        return store.getters[`${taskItemKey}/incompleteInterruptions`].length;
    }

    get categories(): number {
        return store.getters[`${categoryKey}/editableCategories`].length;
    }

    public async createTaskItem(item: TaskItem): Promise<void> {
        const result: TaskItem = await store.dispatch(`${taskItemKey}/addParentTaskItem`, item);

        if (result) {
            const action = result.isInterruption ? 'swapActiveInterruption' : 'swapActiveItem';
            store.dispatch(`${taskItemKey}/${action}`, result);
        }
    }

    public convertToTask(item: TaskItem): void {
        const title = 'This interruption will be converted to a task.';
        const option = new DialogOption(title, 'Convert', 'Cancel');

        option.confirmCallback = () => {
            store.dispatch(`${taskItemKey}/convertInterruption`, item);
        };

        store.dispatch(`${dialogKey}/openDialog`, option);
    }

    public convertToParent(item: TaskItem): void {
        const title = 'This task will be converted to a parent task.';
        const option = new DialogOption(title, 'Convert', 'Cancel');

        option.confirmCallback = () => {
            store.dispatch(`${taskItemKey}/convertChildTask`, item);
        };

        store.dispatch(`${dialogKey}/openDialog`, option);
    }

    public deleteTaskItem(item: TaskItem): void {
        const title = 'This item will be permanently deleted.';
        const checkboxText = item.parent || item.isInterruption ? '' : 'do not remove child tasks';
        const option = new DialogOption(title, 'Delete', 'Cancel', checkboxText, null, true);

        option.confirmCallback = (keepChildren: boolean) => {
            store.dispatch(`${taskItemKey}/deleteTaskItem`, { item, keepChildren });
        };

        store.dispatch(`${dialogKey}/openDialog`, option);
    }

    public async createCategory(category: Category): Promise<void> {
        const result = await store.dispatch(`${categoryKey}/addCategory`, category);

        if (result) {
            store.dispatch(`${categoryKey}/swapActiveCategory`, result);
        }
    }

    public async deleteCategory(category: Category): Promise<void> {
        const title = 'This item will be permanently deleted.';
        const allCategories: Category[] = store.getters[`${categoryKey}/categories`];
        const remaining = allCategories.filter(_ => _.id !== category.id);
        const selected = remaining.find(_ => !_.isEditable && _.name === 'Default');
        const dropdown = new DropdownOption('move items to', remaining, selected, (_: Category) => _.name);
        const option = new DialogOption(title, 'Delete', 'Cancel', '', dropdown, true);

        option.confirmCallback = async(_: boolean, transfer: Category) => {
            const payload = { target: category, transfer };

            if (await store.dispatch(`${categoryKey}/deleteCategory`, payload)) {
                store.dispatch(`${taskItemKey}/loadIncompleteItems`);
            }
        };

        store.dispatch(`${dialogKey}/openDialog`, option);
    }

    public backToMain(): void {
        store.commit(`${mainViewKey}/setActiveView`, ViewOption.MainMenuNoop);
    }

    public closePanel(): void {
        store.commit(`${mainViewKey}/setActiveView`, ViewOption.Inactive);
    }
}
</script>

<style lang="scss" scoped>
.header-content, .main-content, .task-manager, .category-manager, .footer-content {
    display: flex;
    width: 100%;
    height: 100%;
}

.header-content {
    align-items: flex-end;

    .compact-tab-group {
        margin-left: auto;
    }
}

.main-content {
    $margin: 1.5%;

    margin-left: $margin;
    width: calc(100% - #{$margin} * 2);
}

.footer-content {
    align-items: center;

    .back-button, .close-button {
        width: 4.75vw;
        height: 3.5vh;
    }

    .back-button {
        margin-right: 1.5%;
        color: rgb(255, 255, 255);
    }

    .close-button {
        color: rgb(240, 123, 14);
    }

    .item-actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-left: auto;
    }

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

        &.warning-button {
            background-color: rgb(236, 33, 18);

            &:hover {
                background-color: rgb(238, 61, 49);
            }
        }
    }
}
</style>
