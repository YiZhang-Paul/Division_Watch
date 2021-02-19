<template>
    <div class="estimation-skulls-container" :class="{ 'dark-mode': isDarkMode }">
        <div class="image-wrapper">
            <img src="../../assets/images/rogue_skull.png" />
        </div>

        <span>{{ estimationText }}</span>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

import store from '../../store';
import { taskItemKey } from '../../store/task-item/task-item.state';
// eslint-disable-next-line no-unused-vars
import { TaskItemOptions } from '../../core/data-model/task-item/task-item-options';

class EstimationSkullsProp {
    public estimation = prop<number>({ default: 0 });
    public isDarkMode = prop<boolean>({ default: false });
}

export default class EstimationSkulls extends Vue.with(EstimationSkullsProp) {

    get estimationText(): string {
        const { skullDuration } = store.getters[`${taskItemKey}/taskItemOptions`] as TaskItemOptions;
        const estimation = this.estimation / skullDuration;

        if (!estimation) {
            return '';
        }

        return estimation < 1 ? '<1' : `x${Math.floor(estimation)}`;
    }
}
</script>

<style lang="scss" scoped>
.estimation-skulls-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    &.dark-mode .image-wrapper img {
        filter: invert(0%) sepia(1%) saturate(7%) hue-rotate(70deg) brightness(15%) contrast(100%);
    }

    .image-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 82.5%;
        overflow: hidden;

        img {
            height: 150%;
            transition: filter 0.25s;
        }
    }

    span {
        align-self: flex-end;
        font-size: 0.575rem;
    }
}
</style>
