<template>
    <view-panel>
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
                <task-actions v-if="activeTab < 2" class="item-actions" :task="activeTask"></task-actions>
                <category-actions v-if="activeTab === 2" class="item-actions" :category="activeCategory"></category-actions>
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
import { categoryKey } from '../../store/category/category.state';
import { taskItemKey } from '../../store/task-item/task-item.state';
// eslint-disable-next-line no-unused-vars
import { Category } from '../../core/data-model/generic/category';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
import { TabGroupOption } from '../../core/data-model/generic/tab-group-option';
import TitlePanel from '../../shared/panels/TitlePanel.vue';
import ViewPanel from '../../shared/panels/ViewPanel.vue';
import CompactTabGroup from '../../shared/controls/CompactTabGroup.vue';
import MenuButton from '../../shared/controls/MenuButton.vue';
import { ViewOption } from '../../core/enums/view-option.enum';

import TaskActions from './editors/TaskActions.vue';
import CategoryActions from './editors/CategoryActions.vue';
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
        TaskActions,
        CategoryActions,
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
        margin-left: auto;
    }
}
</style>
