<template>
    <div class="active-indicator" v-if="isActive">
        <div></div>
    </div>

    <input-panel class="list-button"
        :class="$attrs.class"
        :hasAnimation="false"
        @click="$emit('activate')">

        <div class="list-button-content" :class="{ 'active-content': isActive }">
            <component :is="action.icon" class="icon" :style="{ color: action.color }"></component>
            <span>{{ action.name }}</span>
            <span v-if="itemCount">x{{ itemCount }}</span>
            <plus class="add-button" @click="$emit('item:add')" />
        </div>
    </input-panel>

    <div class="items" :class="{ 'active-items': isActive }">
        <overlay-scrollbar-panel v-show="isActive" v-if="itemCount" class="scrollbar-wrapper">
            <div><slot></slot></div>
        </overlay-scrollbar-panel>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { Plus } from 'mdue';

import { ActionButton } from '../../core/data-model/action-button';
import InputPanel from '../panels/InputPanel.vue';
import OverlayScrollbarPanel from '../panels/OverlayScrollbarPanel.vue';

class ItemListProp {
    public isActive = prop<boolean>({ default: false });
    public action = prop<ActionButton>({ default: new ActionButton() });
    public itemCount = prop<number>({ default: 0 });
}

@Options({
    components: {
        Plus,
        InputPanel,
        OverlayScrollbarPanel
    },
    emits: [
        'activate',
        'item:add'
    ]
})
export default class ItemList extends Vue.with(ItemListProp) { }
</script>

<style lang="scss" scoped>
.active-indicator {
    position: relative;
    margin-top: 0;
    width: 100%;
    height: 0;
    animation: expandIndicatorVertical 0.2s ease forwards;

    div {
        position: absolute;
        left: 42.5%;
        width: 15%;
        height: 100%;
        background-color: rgb(246, 149, 78);
        filter: brightness(1);
        opacity: 0;
        animation: expandIndicatorHorizontal 0.25s ease 0.1s forwards;
    }
}

.list-button {

    .list-button-content {
        $padding-side: 5%;

        display: flex;
        align-items: center;
        padding: 0 $padding-side;
        width: calc(100% - #{$padding-side} * 2);
        height: 100%;
        background-color: rgba(63, 62, 68, 0.6);
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.5rem;
        transition: color 0.3s, filter 0.3s, background-color 0.2s;

        &:hover, .active-content {
            cursor: pointer;
            background-color: rgb(63, 62, 68);
            color: rgb(255, 255, 255);

            .icon {
                filter: brightness(1);
            }
        }

        span {
            margin-left: 2%;
        }

        .icon, .add-button {
            font-size: 0.8rem;
            filter: brightness(0.7);
        }

        .add-button {
            margin-left: auto;
            color: rgb(246, 149, 78);
            opacity: 0;
            transition: filter 0.3s, opacity 0.3s;

            &:hover {
                filter: brightness(1);
            }
        }

        &:hover .add-button {
            opacity: 1;
        }
    }
}

.items {
    flex: 0;
    width: 100%;
    transition: flex 0.4s;

    .scrollbar-wrapper {
        width: 100%;
        height: 100%;

        & > div {
            display: flex;
            flex-direction: column;
        }
    }

    &.active-items {
        flex: 1;
    }
}

@keyframes expandIndicatorVertical {
    from {
        margin-top: 0;
        height: 0;
    }
    to {
        margin-top: 2px;
        height: 0.75%;
    }
}

@keyframes expandIndicatorHorizontal {
    0% {
        left: 42.5%;
        width: 15%;
        opacity: 0;
    }
    1% {
        opacity: 1;
    }
    100% {
        left: 0;
        width: 100%;
        opacity: 1;
    }
}
</style>
