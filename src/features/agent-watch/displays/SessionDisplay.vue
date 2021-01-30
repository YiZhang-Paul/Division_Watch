<template>
    <div class="session-display-container" :style="{ 'background-color': gaugeColor }">
        <div class="outer-circle"></div>

        <template v-if="percentage <= 50">
            <div class="left-panel-50-minus"></div>
            <div class="right-panel-50-minus" :style="{ transform: 'rotate(' + 360 / 100 * percentage + 'deg)' }"></div>
        </template>

        <template v-if="percentage > 50">
            <div class="left-panel-50-plus"
                :style="{ transform: 'rotate(' + 360 / 100 * (percentage - 50) + 'deg)', 'background-color': colorOption.session }">
            </div>

            <div class="right-panel-50-plus" :style="{ 'background-color': colorOption.session }"></div>
        </template>

        <div class="inner-circle" :style="{ 'background-color': colorOption.background }">
            <img src="../../../assets/images/rogue_skull.png" draggable="false" />
            <span class="remaining-time">{{ minutesLeft }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../../store';
// eslint-disable-next-line no-unused-vars
import { IWatchColorOption, watchBaseKey } from '../../../store/watch-base/watch-base.state';

@Options({
    emits: ['time:depleted']
})
export default class SessionDisplay extends Vue {
    private readonly total = 60 * 25;
    private remaining = this.total;

    get colorOption(): IWatchColorOption {
        return store.getters[`${watchBaseKey}/colorOption`];
    }

    get gaugeColor(): string {
        return this.percentage <= 50 ? this.colorOption.session : 'rgb(138, 11, 11)';
    }

    get minutesLeft(): number {
        return Math.ceil(this.remaining / 60);
    }

    get percentage(): number {
        const elapsed = this.total - this.remaining;

        return Math.floor(elapsed / this.total * 1000) / 10;
    }

    public mounted(): void {
        this.updateRemainingTime();
    }

    private updateRemainingTime(): void {
        this.remaining = Math.max(0, this.remaining - 1);

        if (this.remaining) {
            setTimeout(() => this.updateRemainingTime(), 1000);
        }
        else {
            this.$emit('time:depleted');
        }
    }
}
</script>

<style lang="scss" scoped>
.session-display-container {
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 50%;

    .outer-circle {
        $border-width: 0.115rem;

        position: absolute;
        top: -1%;
        left: -1%;
        z-index: 1;
        width: calc(102% - #{$border-width} * 2);
        height: calc(102% - #{$border-width} * 2);
        border: $border-width solid rgb(226, 34, 34);
        border-radius: 50%;
        box-shadow: inset 0.05rem 0.05rem 0.1rem rgb(117, 0, 0),
                    inset -0.05rem -0.05rem 0.1rem rgb(159, 0, 0);
    }

    .inner-circle {
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
        width: 70%;
        height: 70%;
        border: 0.12rem solid rgb(226, 34, 34);
        border-radius: 50%;
        box-shadow: 0.05rem 0.05rem 0.1rem rgb(117, 0, 0),
                    -0.05rem -0.05rem 0.1rem rgb(159, 0, 0);
    }

    img {
        width: 165%;
    }

    .remaining-time {
        top: 25%;
        position: absolute;
        font-family: 'Bruno Ace';
        font-size: 0.6rem;
        color: rgb(255, 0, 0);
    }

    .left-panel-50-minus,
    .right-panel-50-minus,
    .left-panel-50-plus,
    .right-panel-50-plus {
        position: absolute;
        z-index: 0;
        top: 0;
        width: 50%;
        height: 100%;
        background-color: rgb(138, 11, 11);
    }

    .left-panel-50-minus {
        left: 0;
    }

    .right-panel-50-minus,
    .right-panel-50-plus,
    .left-panel-50-plus {
        left: 50%;
        transform-origin: 0 50%;
    }
}
</style>
