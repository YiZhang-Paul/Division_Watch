<template>
    <view-panel class="activity-manager-container">
        <template v-slot:header>
            <div class="header">
                <title-panel class="title-panel">Activities</title-panel>
                <tab-group class="tab-group" :options="tabs" @tab:selected="activeTab = $event"></tab-group>
            </div>
        </template>

        <template v-slot:footer>
            <div class="footer">
                <menu-button class="back-button" @click="backToMain()">Back</menu-button>
                <menu-button class="close-button" @click="closePanel()">Close</menu-button>
            </div>
        </template>
    </view-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { markRaw } from 'vue';
import { ExclamationThick, InboxMultiple, Target } from 'mdue';

import store from '../../store';
import { mainViewKey } from '../../store/main-view/main-view.state';
import { categoryKey } from '../../store/category/category.state';
import { taskItemKey } from '../../store/task-item/task-item.state';
import { ViewOption } from '../../core/enums/view-option.enum';
import { TabGroupOption } from '../../core/data-model/generic/tab-group-option';
import TitlePanel from '../../shared/panels/TitlePanel.vue';
import ViewPanel from '../../shared/panels/ViewPanel.vue';
import TabGroup from '../../shared/controls/TabGroup.vue';
import MenuButton from '../../shared/controls/MenuButton.vue';

@Options({
    components: {
        ExclamationThick,
        InboxMultiple,
        Target,
        TitlePanel,
        ViewPanel,
        TabGroup,
        MenuButton
    }
})
export default class ActivityManager extends Vue {
    public readonly tabs = [
        markRaw(new TabGroupOption('Task', Target, this.tasks)),
        markRaw(new TabGroupOption('Interruption', ExclamationThick, this.interruptions)),
        markRaw(new TabGroupOption('Category', InboxMultiple, this.categories))
    ];

    public activeTab = 0;

    get tasks(): number {
        return store.getters[`${taskItemKey}/incompleteParentTasks`].length;
    }

    get interruptions(): number {
        return store.getters[`${taskItemKey}/incompleteInterruptions`].length;
    }

    get categories(): number {
        return store.getters[`${categoryKey}/categories`].length;
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
.activity-manager-container {

    .header, .footer {
        display: flex;
        width: 100%;
        height: 100%;
    }

    .header {
        justify-content: space-between;
        align-items: flex-end;
    }

    .footer {
        align-items: center;

        .back-button, .close-button {
            width: 5vw;
            height: 3.75vh;
        }

        .back-button {
            margin-right: 1.5%;
            color: rgb(255, 255, 255);
        }

        .close-button {
            color: rgb(240, 123, 14);
        }
    }
}
</style>