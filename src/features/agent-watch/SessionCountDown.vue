<template>
    <div class="session-count-down-container" :style="{ 'background-color': gaugeColor }">
        <template v-if="percentage <= 50">
            <div class="left-panel-50-minus"></div>
            <div class="right-panel-50-minus" :style="{ transform: 'rotate(' + 360 / 100 * percentage + 'deg)' }"></div>
        </template>

        <template v-if="percentage > 50">
            <div class="left-panel-50-plus" :style="{ transform: 'rotate(' + 360 / 100 * (percentage - 50) + 'deg)' }"></div>
            <div class="right-panel-50-plus"></div>
        </template>

        <div class="inner-circle" :style="{ 'background-color': colorOption.background }">
            <img src="../../assets/images/rogue_skull.png" draggable="false" />
            <span class="remaining-time">{{ minutesLeft }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../store';
// eslint-disable-next-line no-unused-vars
import { IWatchColorOption } from '../../store/watch-base/watch-base.state';

@Options({
    emits: ['time:depleted']
})
export default class SessionCountDown extends Vue {
    private readonly total = 60 * 25;
    private remaining = this.total;

    get colorOption(): IWatchColorOption {
        return store.getters['watchBase/colorOption'];
    }

    get gaugeColor(): string {
        return this.percentage <= 50 ? 'rgb(251, 255, 36)' : 'rgb(138, 11, 11)';
    }

    get minutesLeft(): number {
        return Math.floor(this.remaining / 60);
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
.session-count-down-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 0.21em solid rgb(226, 34, 34);
    border-radius: 50%;
    box-shadow: inset 0.125em 0.125em 0.25em rgb(117, 0, 0),
                inset -0.125em -0.125em 0.25em rgb(159, 0, 0);

    .inner-circle {
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
        width: 75%;
        height: 75%;
        border: 0.17em solid rgb(226, 34, 34);
        border-radius: 50%;
        box-shadow: 0.125em 0.125em 0.25em rgb(117, 0, 0),
                    -0.125em -0.125em 0.25em rgb(159, 0, 0);
    }

    img {
        width: 150%;
    }

    .remaining-time {
        top: 25%;
        position: absolute;
        font-family: 'Bruno Ace';
        font-size: 1.4em;
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

    .left-panel-50-plus,
    .right-panel-50-plus {
        background-color: rgb(251, 255, 36);
    }
}
</style>
