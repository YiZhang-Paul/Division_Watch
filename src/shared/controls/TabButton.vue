<template>
    <div class="tab-button-container">
        <div v-if="isActive" class="indicator"></div>

        <display-panel :class="buttonClass">
            <div class="content">
                <div class="tab-name">
                    <component v-if="icon" class="icon" :is="icon"></component>
                    <slot></slot>
                </div>

                <div v-if="badgeValue" class="badge">
                    <span>{{ badgeValue }}</span>
                </div>
            </div>
        </display-panel>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import VanillaTilt from 'vanilla-tilt';

import DisplayPanel from '../panels/DisplayPanel.vue';

class TabButtonProp {
    public isActive = prop<boolean>({ default: false });
    public icon = prop<any>({ default: null });
    public badgeValue = prop<number>({ default: 0 });
}

@Options({
    components: {
        DisplayPanel
    }
})
export default class TabButton extends Vue.with(TabButtonProp) {
    public readonly buttonClass = 'tab-button';

    public mounted(): void {
        const container = document.querySelector(`.${this.buttonClass}`);
        VanillaTilt.init(container as HTMLElement, { max: 0, glare: true, 'max-glare': 0.2 });
    }
}
</script>

<style lang="scss" scoped>
.tab-button-container {
    position: relative;

    .indicator {
        $indicator-height: 0.4vh;

        position: absolute;
        top: calc(-#{$indicator-height} - 0.25vh);
        left: 40%;
        width: 20%;
        height: $indicator-height;
        background-color: rgb(240, 123, 14);
        opacity: 0;
        animation: revealContent 0.2s ease 0.05s forwards,
                   expandIndicator 0.3s ease 0.1s forwards;
    }

    .tab-button {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(180, 180, 180, 0.2);
        color: rgb(255, 255, 255);
        font-size: 0.6rem;

        &:hover {
            cursor: pointer;
        }

        .content {
            display: flex;
            margin: 0.35vh 0.4vh;

            .tab-name {
                display: flex;
                align-items: center;
                padding: 0.25% 1.25rem;
                background-color: rgba(55, 55, 55, 0.45);
                transition: background-color 0.3s;

                .icon {
                    margin-right: 0.1rem;
                    font-size: 0.7rem;
                }
            }

            .badge {
                padding: 0 0.15rem;
                background-color: rgba(240, 123, 14, 0.7);
            }

            &:hover .tab-name {
                background-color: rgba(70, 70, 70, 0.45);
            }
        }
    }

    @keyframes expandIndicator {
        from {
            left: 40%;
            width: 20%;
        }
        to {
            left: 0;
            width: 100%;
        }
    }
}
</style>
