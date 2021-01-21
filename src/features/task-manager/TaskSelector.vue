<template>
    <glass-panel>
        <div class="task-selector-content">
            <item-list v-if="isLoaded"
                class="item-list"
                :isActive="activeButton === taskButton.name"
                :action="taskButton"
                :itemCount="parentTasks.length"
                @activate="activeButton = taskButton.name"
                @item:add="openEmptyTask()">

                <task-summary-card v-for="task of parentTasks"
                    class="summary-card"
                    :class="{ 'active-card': activeButton === taskButton.name }"
                    :key="task.name"
                    :task="task"
                    @click="onTaskItemSelect(task)">
                </task-summary-card>
            </item-list>

            <item-list v-if="isLoaded"
                class="item-list"
                :isActive="activeButton === interruptionButton.name"
                :action="interruptionButton"
                :itemCount="interruptions.length"
                @activate="activeButton = interruptionButton.name"
                @item:add="openEmptyTask(true)">

                <task-summary-card v-for="interruption of interruptions"
                    class="summary-card"
                    :class="{ 'active-card': activeButton === interruptionButton.name }"
                    :key="interruption.name"
                    :task="interruption"
                    @click="onTaskItemSelect(interruption)">
                </task-summary-card>
            </item-list>

            <item-list v-if="isLoaded"
                class="item-list"
                :isActive="activeButton === categoryButton.name"
                :action="categoryButton"
                :itemCount="categories.length"
                @activate="activeButton = categoryButton.name"
                @item:add="openEmptyCategory()">

                <category-summary-card v-for="category of categories"
                    class="summary-card"
                    :class="{ 'active-card': activeButton === categoryButton.name }"
                    :key="category.name"
                    :category="category"
                    @click="onCategorySelect(category)">
                </category-summary-card>
            </item-list>
        </div>
    </glass-panel>
</template>

<script lang="ts">
import { markRaw } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { ExclamationThick, FormatListBulletedType, Plus, TimerSand } from 'mdue';

import store from '../../store';
import { ActionButton } from '../../core/data-model/action-button';
// eslint-disable-next-line no-unused-vars
import { Category } from '../../core/data-model/category';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item';
// eslint-disable-next-line no-unused-vars
import { TaskItemOptions } from '../../core/data-model/task-item-options';
import { TaskItemList } from '../../core/enums/task-item-list.enum';
import CategorySummaryCard from '../../shared/cards/CategorySummaryCard.vue';
import TaskSummaryCard from '../../shared/cards/TaskSummaryCard.vue';
import InputPanel from '../../shared/panels/InputPanel.vue';
import GlassPanel from '../../shared/panels/GlassPanel.vue';
import ItemList from '../../shared/components/ItemList.vue';

@Options({
    components: {
        ExclamationThick,
        Plus,
        TimerSand,
        CategorySummaryCard,
        TaskSummaryCard,
        InputPanel,
        GlassPanel,
        ItemList
    }
})
export default class TaskSelector extends Vue {
    public taskButton = new ActionButton(TaskItemList.Tasks, markRaw(TimerSand), 'rgb(255, 28, 82)');
    public interruptionButton = new ActionButton(TaskItemList.Interruptions, markRaw(ExclamationThick), 'rgb(0, 117, 255)');
    public categoryButton = new ActionButton(TaskItemList.Categories, markRaw(FormatListBulletedType), 'rgb(245, 238, 58)');
    public isLoaded = false;

    get categories(): Category[] {
        return store.getters['category/categories'];
    }

    get parentTasks(): TaskItem[] {
        return store.getters['taskItem/incompleteParentTasks'];
    }

    get interruptions(): TaskItem[] {
        return store.getters['taskItem/incompleteInterruptions'];
    }

    get activeButton(): string {
        return store.getters['taskItem/activeTaskItemList'];
    }

    set activeButton(name: string) {
        store.commit('taskItem/setActiveTaskItemList', name);
    }

    public created(): void {
        store.dispatch('taskItem/loadIncompleteTaskItems');
    }

    public mounted(): void {
        setTimeout(() => this.isLoaded = true, 1500);
    }

    public async openEmptyTask(isInterruption = false): Promise<void> {
        const task: TaskItem = await store.dispatch('taskItem/getEmptyTaskItem');
        task.isInterruption = isInterruption;
        store.dispatch('taskItem/swapActiveTaskItem', task);
    }

    public onTaskItemSelect(task: TaskItem): void {
        if (store.getters['taskItem/activeTaskItem']?.id !== task.id) {
            store.dispatch('taskItem/swapActiveTaskItem', task);
        }
    }

    public onCategorySelect(category: Category): void {
        if (store.getters['category/activeCategory']?.id !== category.id) {
            store.dispatch('category/swapActiveCategory', category);
        }
    }
}
</script>

<style lang="scss" scoped>
.task-selector-content {
    display: flex;
    flex-direction: column;
    padding-top: 5px;
    width: 100%;
    height: calc(100% - 5px);

    ::v-deep .item-list {
        margin-top: 2px;
        width: 100%;
        height: 7%;
        max-height: 50px;
    }

    .summary-card {
        margin-bottom: 1px;
        width: 100%;
        height: 5vh;
        max-height: 55px;
        opacity: 0;

        &.active-card {
            animation: revealContent 0.3s ease 0.4s forwards;
        }
    }
}
</style>
