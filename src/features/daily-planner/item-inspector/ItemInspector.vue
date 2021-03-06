<template>
    <div v-if="item" class="item-inspector-container" :class="{ 'loaded': isLoaded }">
        <div class="main-content glass-panel-light">
            <item-inspector-title class="item-inspector-title" :item="item"></item-inspector-title>
            <item-inspector-additional-info class="additional-info" :item="item"></item-inspector-additional-info>
            <div class="progression"></div>

            <item-inspector-tab-panels class="tab-panels"
                :plan="plan"
                :item="item"
                :activeTab="activeTab"
                @tab:select="activeTab = $event"
                @item:select="$emit('item:select', $event)">
            </item-inspector-tab-panels>
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

import store from '../../../store';
import { soundKey } from '../../../store/sound/sound.state';
// eslint-disable-next-line no-unused-vars
import { DailyPlan } from '../../../core/data-model/generic/daily-plan';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../../core/data-model/task-item/task-item';
import { SoundOption } from '../../../core/data-model/generic/sound-option';
import MenuButton from '../../../shared/controls/MenuButton.vue';
import { SoundType } from '../../../core/enums/sound-type.enum';

import ItemInspectorTitle from './ItemInspectorTitle.vue';
import ItemInspectorAdditionalInfo from './ItemInspectorAdditionalInfo.vue';
import ItemInspectorTabPanels from './ItemInspectorTabPanels.vue';

class ItemInspectorProp {
    public plan = prop<DailyPlan>({ default: null });
    public item = prop<TaskItem>({ default: null });
}

@Options({
    components: {
        MenuButton,
        ItemInspectorTitle,
        ItemInspectorAdditionalInfo,
        ItemInspectorTabPanels
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

        .tab-panels {
            width: 100%;
            height: 45%;
            border-top: 1px solid rgba(225, 225, 225, 0.2);
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
