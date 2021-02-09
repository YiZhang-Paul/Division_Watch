<template>
    <div class="estimation-skulls-container">
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
}

export default class EstimationSkulls extends Vue.with(EstimationSkullsProp) {

    get estimationText(): string {
        const { skullDuration } = store.getters[`${taskItemKey}/taskItemOptions`] as TaskItemOptions;
        const estimation = this.estimation / skullDuration;

        return estimation < 1 ? '<1' : `x${Math.floor(estimation)}`;
    }
}
</script>

<style lang="scss" scoped>
.estimation-skulls-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .image-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 85%;
        overflow: hidden;

        img {
            height: 150%;
        }
    }

    span {
        align-self: flex-end;
    }
}
</style>
