<template>
    <div class="session-count-down-container">
        <div class="inner-circle" :style="{ 'background-color': colorOption.background }">
            <img src="../../assets/images/rogue_skull.png" draggable="false" />
            <span class="remaining-time">{{ minutesLeft }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

import store from '../../store';
// eslint-disable-next-line no-unused-vars
import { IWatchColorOption } from '../../store/watch-base/watch-base.state';

export default class SessionCountDown extends Vue {
    private remaining = 60 * 25;

    get colorOption(): IWatchColorOption {
        return store.getters['watchBase/colorOption'];
    }

    get minutesLeft(): number {
        return Math.floor(this.remaining / 60);
    }

    public mounted(): void {
        this.updateRemainingTime();
    }

    private updateRemainingTime(): void {
        this.remaining = Math.max(0, this.remaining - 1);
        setTimeout(() => this.updateRemainingTime(), 1000);
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
    border-radius: 50%;
    background-color: rgb(130, 130, 130);

    .inner-circle {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 75%;
        height: 75%;
        border-radius: 50%;
    }

    img {
        width: 150%;
    }

    .remaining-time {
        top: 30%;
        position: absolute;
        font-family: 'Bruno Ace';
        font-size: 1.5em;
        color: rgb(255, 0, 0);
    }
}
</style>
