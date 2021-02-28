<template>
    <div class="planner-selection-card-container">
        <span>Planner</span>

        <div class="content">
            <div class="icon-wrapper">
                <img src="../../../assets/icons/sharpshooter.svg" />
            </div>

            <div class="items-due">
                <span>Due & Overdue:</span>

                <counter-display class="counter-display"
                    :class="{ 'alert-value': totalDue }"
                    :value="totalDue">
                </counter-display>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../../store';
import { taskItemKey } from '../../../store/task-item/task-item.state';
import CounterDisplay from '../../../shared/widgets/CounterDisplay.vue';

@Options({
    components: {
        CounterDisplay
    }
})
export default class PlannerSelectionCard extends Vue {

    get totalDue(): number {
        return store.getters[`${taskItemKey}/totalNearDue`] + store.getters[`${taskItemKey}/totalPastDue`];
    }
}
</script>

<style lang="scss" scoped>
.planner-selection-card-container {
    box-sizing: border-box;
    flex-direction: column;
    align-items: center;

    &:hover {

        .content .icon-wrapper img {
            opacity: 0.8;
            filter: invert(0%) sepia(100%) saturate(0%) hue-rotate(21deg) brightness(97%) contrast(103%);
        }

        .counter-display {
            color: rgba(30, 30, 30, 0.9);

            ::v-deep .placeholder {
                color: rgba(30, 30, 30, 0.4);
            }
        }
    }

    & > span {
        margin-top: 0.575rem;
        z-index: 1;
    }

    .content {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .icon-wrapper {
            position: relative;
            margin-bottom: 0.4rem;
            width: 8rem;
            height: 8rem;
            overflow: hidden;

            img {
                position: absolute;
                left: -49.25%;
                height: 100%;
                opacity: 1;
                filter: invert(74%) sepia(18%) saturate(4544%) hue-rotate(201deg) brightness(101%) contrast(102%);
                transition: filter 0.25s, opacity 0.25s;
            }
        }

        .items-due {
            display: flex;
            align-items: center;
            font-size: 0.575rem;

            & > span {
                margin-right: 0.1rem;
            }

            .counter-display.alert-value {
                color: rgb(245, 9, 48);
            }
        }
    }
}
</style>
