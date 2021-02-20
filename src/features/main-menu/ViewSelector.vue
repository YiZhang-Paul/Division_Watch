<template>
    <div class="view-selector-container" :class="{ 'no-op': !allowAnimation }">
        <div class="planner-selection-card selection-card">
            <span>Planner</span>

            <div class="icon-wrapper">
                <img src="../../assets/icons/sharpshooter.svg" />
            </div>
        </div>

        <div class="ongoing-selection-card selection-card"></div>

        <activities-selection-card class="activities-selection-card selection-card"
            :chartDelay="allowAnimation ? 3200 : 650"
            @click="$emit('view:selected', options.Activities)">
        </activities-selection-card>

        <div class="login-selection-card selection-card">
            <user-avatar class="user-avatar"></user-avatar>
            <span>Log in</span>
        </div>

        <div class="settings-selection-card selection-card">
            <span>Settings</span>
        </div>

        <div class="dashboard-selection-card selection-card"></div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import { ViewOption } from '../../core/enums/view-option.enum';
import UserAvatar from '../../shared/widgets/UserAvatar.vue';

import ActivitiesSelectionCard from './view-selection-cards/ActivitiesSelectionCard.vue';

class ViewSelectorProp {
    public allowAnimation = prop<boolean>({ default: true });
}

@Options({
    components: {
        UserAvatar,
        ActivitiesSelectionCard
    },
    emits: ['view:selected']
})
export default class ViewSelector extends Vue.with(ViewSelectorProp) {
    public options = ViewOption;
}
</script>

<style lang="scss" scoped>
.view-selector-container {
    $vertical-gap: 1.25%;
    $horizontal-gap: 1%;
    $planner-card-height: 60%;
    $activities-card-height: 80%;

    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    height: 100%;

    .selection-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
        border: 1px solid rgba(240, 240, 240, 0.7);
        background-color: rgba(25, 25, 25, 0.45);
        box-shadow: 3px 3px 3px rgba(121, 121, 121, 0.25);
        color: rgb(255, 255, 255);
        line-height: 1.1rem;
        font-size: 1.15rem;
        filter: brightness(0.95);
        transition: filter 0.25s, border 0.25s, background-color 0.25s, color 0.25s;
        animation: blinkFast 0.15s ease-in forwards 2;

        &:hover {
            cursor: pointer;
            border: 1px solid rgba(25, 25, 25, 0.85);
            background-color: rgba(240, 158, 29, 0.88);
            color: rgba(35, 35, 35, 0.9);
            filter: brightness(1);
        }
    }

    &.no-op .selection-card {
        animation: none;
    }

    .planner-selection-card,
    .ongoing-selection-card,
    .activities-selection-card,
    .login-selection-card,
    .settings-selection-card {
        width: calc((100% - #{$horizontal-gap} * 2) * 0.32);
    }

    .planner-selection-card, .ongoing-selection-card {
        margin-right: $horizontal-gap;
        animation-delay: 0.15s;
    }

    .planner-selection-card {
        flex-direction: column;
        height: calc(#{$planner-card-height} - #{$vertical-gap});

        &:hover .icon-wrapper img {
            opacity: 0.8;
            filter: invert(0%) sepia(100%) saturate(0%) hue-rotate(21deg) brightness(97%) contrast(103%);
        }

        span {
            margin-top: 0.575rem;
            z-index: 1;
        }

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
    }

    .ongoing-selection-card {
        height: calc(100% - #{$planner-card-height});
    }

    .activities-selection-card {
        height: calc(#{$activities-card-height} - #{$vertical-gap} * 2);
    }

    .login-selection-card {
        justify-content: center;
        position: relative;
        height: calc((100% - #{$activities-card-height}) * 0.575);

        &:hover .user-avatar {
            border-color: rgba(35, 35, 35, 0.75);
            background-color: transparent;
        }

        .user-avatar {
            position: absolute;
            left: 7.5%;
            width: 1.45rem;
            height: 1.45rem;
            transition: background-color 0.25s, border-color 0.25s;
        }
    }

    .settings-selection-card {
        justify-content: center;
        height: calc((100% - #{$activities-card-height}) * 0.425);
        animation-delay: 0.1s;
    }

    .dashboard-selection-card {
        margin-left: $horizontal-gap;
        width: calc((100% - #{$horizontal-gap} * 2) * 0.36);
        height: 100%;
        animation-delay: 0.2s;
    }
}
</style>
