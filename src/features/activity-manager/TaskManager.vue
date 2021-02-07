<template>
    <div class="task-manager-container">
        <item-list-panel class="item-list-panel" @search="searchText = $event">
            <task-summary-card class="summary-card"
                v-for="task of tasks"
                :key="task.id"
                :task="task"
                @click="onTaskSelected(task)">
            </task-summary-card>
        </item-list-panel>

        <div class="editor-area">
            <option-dropdown class="editor-control"
                :name="'Category'"
                :selected="selectedCategory"
                :options="categories"
                :transform="_ => _.name"
                @options:select="onItemChange('categoryId', $event.id)">
            </option-dropdown>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../store';
import { categoryKey } from '../../store/category/category.state';
import { taskItemKey } from '../../store/task-item/task-item.state';
import { Category } from '../../core/data-model/generic/category';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
import ItemListPanel from '../../shared/panels/ItemListPanel.vue';
import OptionDropdown from '../../shared/controls/OptionDropdown.vue';
import TaskSummaryCard from '../../shared/cards/TaskSummaryCard.vue';

@Options({
    components: {
        ItemListPanel,
        OptionDropdown,
        TaskSummaryCard
    }
})
export default class TaskManager extends Vue {
    public searchText = '';

    get categories(): Category[] {
        const categories: Category[] = store.getters[`${categoryKey}/categories`];

        return [new Category('N/A'), ...categories];
    }

    get selectedCategory(): Category {
        return store.getters[`${categoryKey}/category`](this.activeTask?.categoryId);
    }

    get activeTask(): TaskItem | null {
        return store.getters[`${taskItemKey}/activeTaskItem`];
    }

    get tasks(): TaskItem[] {
        const tasks: TaskItem[] = store.getters[`${taskItemKey}/incompleteParentTasks`];

        return tasks.filter(_ => _.name.toLowerCase().includes(this.searchText));
    }

    public onItemChange(key: string, value: any): void {
        const changed = { ...this.activeTask!, [key]: value };
        store.commit(`${taskItemKey}/setActiveTaskItem`, changed);

        if (!changed.id) {
            return;
        }
    }

    public onTaskSelected(task: TaskItem): void {
        store.dispatch(`${taskItemKey}/swapActiveTaskItem`, task);
    }
}
</script>

<style lang="scss" scoped>
.task-manager-container {
    $list-width: 30%;

    .item-list-panel {
        width: $list-width;
        height: 95%;

        .summary-card {
            width: 100%;
            height: 12.5vh;

            &:not(:nth-last-child(1)) {
                margin-bottom: 1vh;
            }
        }
    }

    .editor-area {
        width: calc(100% - #{$list-width});
        height: 100%;

        .editor-control {
            width: 85%;
        }
    }
}
</style>
