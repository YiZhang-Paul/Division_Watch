<template>
    <div v-if="item" class="item-inspector-container" :class="{ 'loaded': isLoaded }">
        <div class="main-content glass-panel-light">
            <item-inspector-title class="item-inspector-title" :item="item"></item-inspector-title>
            <item-inspector-additional-info class="additional-info" :item="item"></item-inspector-additional-info>

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

import ItemInspectorTitle from './ItemInspectorTitle.vue';
import ItemInspectorAdditionalInfo from './ItemInspectorAdditionalInfo.vue';

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
        ItemInspectorTitle,
        ItemInspectorAdditionalInfo
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

        .additional-info {
            height: 10.5%;
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
