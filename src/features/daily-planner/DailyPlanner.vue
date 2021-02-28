<template>
    <view-panel>
        <template v-slot:header>
            <div class="header-content">
                <title-panel :activeGrid="1">Planner</title-panel>
            </div>
        </template>

        <div class="main-content">
            <item-list-panel class="item-list-panel"
                :allowAdd="false"
                @item:search="searchText = $event">

                <task-summary-card class="summary-card"
                    v-for="candidate of candidates"
                    :key="candidate.id"
                    :task="candidate"
                    :isUrgent="candidate.isInterruption"
                    @mouseenter="onCardHover()">
                </task-summary-card>

                <placeholder-panel v-if="!candidates.length"
                    class="placeholder-panel"
                    :text="searchText ? 'no matching entry found.' : 'no entry available.'">
                </placeholder-panel>
            </item-list-panel>
        </div>

        <template v-slot:footer>
            <div class="footer-content">
                <menu-button class="back-button" @click="backToMain()">Back</menu-button>
                <menu-button class="close-button" @click="closePanel()">Close</menu-button>
            </div>
        </template>
    </view-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../store';
import { soundKey } from '../../store/sound/sound.state';
import { mainViewKey } from '../../store/main-view/main-view.state';
import { taskItemKey } from '../../store/task-item/task-item.state';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
import { SoundOption } from '../../core/data-model/generic/sound-option';
import TaskSummaryCard from '../../shared/cards/TaskSummaryCard.vue';
import TitlePanel from '../../shared/panels/TitlePanel.vue';
import ViewPanel from '../../shared/panels/ViewPanel.vue';
import ItemListPanel from '../../shared/panels/ItemListPanel.vue';
import PlaceholderPanel from '../../shared/panels/PlaceholderPanel.vue';
import MenuButton from '../../shared/controls/MenuButton.vue';
import { ViewOption } from '../../core/enums/view-option.enum';
import { SoundType } from '../../core/enums/sound-type.enum';

@Options({
    components: {
        TaskSummaryCard,
        TitlePanel,
        ViewPanel,
        ItemListPanel,
        PlaceholderPanel,
        MenuButton
    }
})
export default class DailyPlanner extends Vue {
    public searchText = '';

    get candidates(): TaskItem[] {
        const items: TaskItem[] = store.getters[`${taskItemKey}/incompleteInterruptionsAndParentTasks`];

        return items.filter(_ => _.name.toLowerCase().includes(this.searchText));
    }

    public onCardHover(): void {
        store.dispatch(`${soundKey}/playSound`, new SoundOption('button_hover', SoundType.UI));
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
.header-content, .main-content, .footer-content {
    display: flex;
    width: 100%;
    height: 100%;
}

.header-content {
    align-items: flex-end;
}

.main-content {
    $margin: 1.5%;
    $list-width: 28%;

    margin-left: $margin;
    width: calc(100% - #{$margin} * 2);

    .item-list-panel {
        width: $list-width;
        height: 97.5%;

        .summary-card {
            width: 100%;
            height: 10.5vh;
            opacity: 0;
            animation: revealContent 0.3s ease 0.1s forwards;

            &:not(:nth-last-child(1)) {
                margin-bottom: 0.9vh;
            }
        }

        .placeholder-panel {
            margin-left: 2.5%;
            width: 95%;
        }
    }
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
}
</style>
