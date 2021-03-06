<template>
    <div v-if="item" class="item-inspector-container" :class="{ 'loaded': isLoaded }">
        <div class="main-content glass-panel-light">
            <item-inspector-title class="item-inspector-title" :item="item"></item-inspector-title>

            <div class="category">
                <component v-if="categoryIcon" class="icon" :is="categoryIcon"></component>
                <span>{{ category.name }}</span>
            </div>

            <div class="deadline">
                <template v-if="item.deadline || item.recur.some(_ => _)">
                    <span v-if="item.deadline">Due on {{ deadline }}</span>
                    <span v-if="!item.deadline">Occurs {{ recur }}</span>
                    <span v-if="item.dueTime">&nbsp;by {{ dueTime }}</span>
                </template>

                <span v-if="!item.deadline && item.recur.every(_ => !_)">No deadline/recur specified.</span>
            </div>

            <div class="progression"></div>

            <div class="tabs">
                <div class="tab-buttons">
                    <menu-button class="tab-button"
                        :class="{ 'active-tab': activeTab === 0 }"
                        @click="activeTab = 0">

                        Subtasks
                    </menu-button>

                    <menu-button class="tab-button"
                        :class="{ 'active-tab': activeTab === 1 }"
                        @click="activeTab = 1">

                        Checklist
                    </menu-button>

                    <sitemap v-if="activeTab === 0" class="icon" />
                    <order-bool-ascending-variant v-if="activeTab === 1" class="icon" />
                </div>

                <div v-if="activeTab === 0" class="subtasks">
                    <overlay-scrollbar-panel v-if="childTasks.length" class="overlay-scrollbar-panel">
                        <div class="list-wrapper">
                            <compact-task-summary-card v-for="task of childTasks"
                                class="summary-card"
                                :key="task.id"
                                :task="task"
                                :isReadonly="true"
                                @click="$emit('item:select', task.id)">
                            </compact-task-summary-card>
                        </div>
                    </overlay-scrollbar-panel>

                    <placeholder-panel v-if="!childTasks.length"
                        class="placeholder-panel"
                        :text="'no subtask available.'">
                    </placeholder-panel>
                </div>

                <div v-if="activeTab === 1" class="checklist">
                    <overlay-scrollbar-panel v-if="item.checklist.length" class="overlay-scrollbar-panel">
                        <div class="list-wrapper">
                            <checklist-card v-for="(checklist, index) of item.checklist"
                                class="checklist-card"
                                :key="index"
                                :item="checklist"
                                :isReadonly="true">
                            </checklist-card>
                        </div>
                    </overlay-scrollbar-panel>

                    <placeholder-panel v-if="!item.checklist.length"
                        class="placeholder-panel"
                        :text="'no checklist available.'">
                    </placeholder-panel>
                </div>
            </div>
        </div>

        <div class="footer-content">
            <div class="row-1">
                <menu-button class="register-button" @click="$emit('register:planned')">Mark as Planned</menu-button>
                <menu-button class="register-button" @click="$emit('register:potential')">Mark as Potential</menu-button>
            </div>

            <div class="row-2">
                <menu-button v-if="item.parent"
                    class="back-button"
                    @click="$emit('item:select', item.parent)">

                    Back to Parent Task
                </menu-button>

                <menu-button class="cancel-button" @click="$emit('item:cancel')">Cancel</menu-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { OrderBoolAscendingVariant, Sitemap } from 'mdue';

import store from '../../../store';
import { soundKey } from '../../../store/sound/sound.state';
import { taskItemKey } from '../../../store/task-item/task-item.state';
import { categoryKey } from '../../../store/category/category.state';
// eslint-disable-next-line no-unused-vars
import { Category } from '../../../core/data-model/generic/category';
// eslint-disable-next-line no-unused-vars
import { DailyPlan } from '../../../core/data-model/generic/daily-plan';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../../core/data-model/task-item/task-item';
import { SoundOption } from '../../../core/data-model/generic/sound-option';
import CompactTaskSummaryCard from '../../../shared/cards/CompactTaskSummaryCard.vue';
import ChecklistCard from '../../../shared/cards/ChecklistCard.vue';
import PlaceholderPanel from '../../../shared/panels/PlaceholderPanel.vue';
import OverlayScrollbarPanel from '../../../shared/panels/OverlayScrollbarPanel.vue';
import MenuButton from '../../../shared/controls/MenuButton.vue';
import { SoundType } from '../../../core/enums/sound-type.enum';
import { TimeUtility } from '../../../core/utilities/time/time.utility';
import { GenericUtility } from '../../../core/utilities/generic/generic.utility';

import ItemInspectorTitle from './ItemInspectorTitle.vue';

class ItemInspectorProp {
    public plan = prop<DailyPlan>({ default: null });
    public item = prop<TaskItem>({ default: null });
}

@Options({
    components: {
        OrderBoolAscendingVariant,
        Sitemap,
        CompactTaskSummaryCard,
        ChecklistCard,
        PlaceholderPanel,
        OverlayScrollbarPanel,
        MenuButton,
        ItemInspectorTitle
    },
    watch: {
        item(): void { this.activeTab = 0; }
    },
    emits: [
        'register:planned',
        'register:potential',
        'item:select',
        'item:cancel'
    ]
})
export default class ItemInspector extends Vue.with(ItemInspectorProp) {
    public isLoaded = false;
    public activeTab = 0;

    get category(): Category | null {
        const id = this.parent ? this.parent.categoryId : this.item.categoryId;

        return store.getters[`${categoryKey}/category`](id);
    }

    get categoryIcon(): any {
        return GenericUtility.getIcon(this.category?.icon ?? '');
    }

    get parent(): TaskItem | null {
        if (!this.item.parent) {
            return null;
        }

        return store.getters[`${taskItemKey}/incompleteItem`](this.item.parent);
    }

    get deadline(): string {
        return this.item.deadline ? TimeUtility.toLongDateString(new Date(this.item.deadline)) : '';
    }

    get recur(): string {
        const include = this.item.recur.map((_, i) => _ ? i : -1).filter(_ => _ !== -1);

        if (include.length === 7) {
            return 'everyday';
        }
        else if (include.length === 1) {
            return `on ${TimeUtility.getDayOfWeek(include[0])}`;
        }

        const includeText = `on ${include.map(_ => TimeUtility.getDayOfWeek(_).slice(0, 3)).join(', ')}`;
        const exclude = this.item.recur.map((_, i) => _ ? -1 : i).filter(_ => _ !== -1);
        const excludeText = `everyday except ${exclude.map(_ => TimeUtility.getDayOfWeek(_).slice(0, 3)).join(', ')}`;

        return includeText.length <= excludeText.length ? includeText : excludeText;
    }

    get dueTime(): string {
        if (!this.item.dueTime) {
            return '';
        }

        return this.item.dueTime.split(':').map(_ => TimeUtility.prependZero(Number(_))).join(':');
    }

    get childTasks(): TaskItem[] {
        if (this.item.isInterruption) {
            return [];
        }

        const children = store.getters[`${taskItemKey}/incompleteChildTasksByParentId`](this.item.id) as TaskItem[];
        const ids = new Set([...this.plan.planned, ...this.plan.potential]);

        return children.filter(_ => !ids.has(_.id ?? ''));
    }

    public mounted(): void {
        store.dispatch(`${soundKey}/playSound`, new SoundOption('tab_open', SoundType.UI));
        setTimeout(() => this.isLoaded = true, 500);
    }
}
</script>

<style lang="scss" scoped>
.item-inspector-container {
    opacity: 0;
    animation: revealContent ease forwards;
    animation-duration: 0.2s;
    animation-delay: 0.3s;

    &.loaded {
        animation-duration: 0.05s;
        animation-delay: 0.1s;

        .footer-content {
            animation-delay: 0.1s;
        }
    }

    .main-content, .footer-content {
        display: flex;
        width: 100%;
    }

    .main-content {
        flex-direction: column;
        height: calc(100% - 2rem);

        .item-inspector-title {
            width: 100%;
            height: 11.5%;
            border-bottom: 1px solid rgba(225, 225, 225, 0.2);
        }

        .category {
            box-sizing: border-box;
            display: flex;
            align-items: center;
            padding: 2% 3.5%;
            height: 7%;
            color: rgb(255, 255, 255);
            font-size: 0.6rem;

            .icon {
                margin-right: 2.5%;
                font-size: 0.85rem;
            }
        }

        .deadline {
            display: flex;
            align-items: flex-start;
            padding: 0 4.5%;
            height: 3.5%;
            color: rgb(255, 255, 255);
            font-size: 0.425rem;
            line-height: 0.425rem;
        }

        .progression {
            flex-grow: 1;
            width: 100%;
            border-top: 1px solid rgba(225, 225, 225, 0.2);
        }

        .tabs {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 45%;
            border-top: 1px solid rgba(225, 225, 225, 0.2);

            .tab-buttons {
                box-sizing: border-box;
                display: flex;
                align-items: center;
                padding: 0 5%;
                width: 100%;
                height: 4.25vh;

                .tab-button {
                    margin-top: 2.5%;
                    width: 3.5vw;
                    height: 2vh;
                    color: rgb(255, 255, 255);
                    font-size: 0.4rem;

                    &:nth-child(1) {
                        margin-right: 1.5%;
                    }

                    &.active-tab {
                        background-color: rgb(240, 123, 14);
                    }
                }

                .icon {
                    align-self: flex-end;
                    margin-left: auto;
                    color: rgb(255, 255, 255);
                    opacity: 0;
                    animation: revealContent 0.3s ease forwards;
                }
            }

            .subtasks, .checklist {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: calc(100% - 4.25vh);

                .overlay-scrollbar-panel {
                    width: 85%;
                    height: 87.5%;

                    .list-wrapper {
                        width: 100%;
                        height: 100%;

                        .summary-card, .checklist-card {
                            width: 100%;
                            height: 4.5vh;
                            opacity: 0;
                            animation: revealContent 0.3s ease forwards;

                            &:not(:nth-last-child(1)) {
                                margin-bottom: 1.5%;
                            }
                        }
                    }
                }

                .placeholder-panel {
                    width: 85%;
                }
            }
        }
    }

    .footer-content {
        display: flex;
        flex-direction: column;
        opacity: 0;
        animation: revealContent 0.3s ease 0.4s forwards;

        .row-1, .row-2 {
            display: flex;
            margin-top: 1.25vh;
            width: 100%;
            height: 2.5vh;
        }

        .row-1 {
            justify-content: space-between;
        }

        .back-button, .cancel-button, .register-button {
            color: rgb(255, 255, 255);
            font-size: 0.5rem;
        }

        .register-button {
            width: 8vw;
            background-color: rgb(50, 158, 149);
        }

        .back-button {
            margin-right: calc(100% - 8vw * 2);
            width: 8.5vw;
            color: rgb(240, 123, 14);
            opacity: 0;
            animation: revealContent 0.3s ease 0.1s forwards;
        }

        .cancel-button {
            width: 4.5vw;
        }
    }
}
</style>
