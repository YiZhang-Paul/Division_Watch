<template>
    <div class="view-selector-container">
        <div class="planner-selection-card selection-card">
            <span>Planner</span>
            <div class="planner-icon"></div>
        </div>

        <div class="ongoing-selection-card selection-card"></div>
        <activities-selection-card class="activities-selection-card selection-card"></activities-selection-card>

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
import { Options, Vue } from 'vue-class-component';

import UserAvatar from '../../shared/widgets/UserAvatar.vue';

import ActivitiesSelectionCard from './view-selection-cards/ActivitiesSelectionCard.vue';

@Options({
    components: {
        UserAvatar,
        ActivitiesSelectionCard
    }
})
export default class ViewSelector extends Vue { }
</script>

<style lang="scss" scoped>
.view-selector-container {
    $vertical-gap: 1.25%;
    $horizontal-gap: 1%;
    $planner-card-height: 60%;
    $activities-card-height: 75%;

    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    height: 100%;

    .selection-card {
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        border: 2px solid rgba(195, 195, 195, 0.6);
        background-color: rgba(0, 0, 0, 0.45);
        box-shadow: 3px 3px 3px rgba(121, 121, 121, 0.25);
        color: rgb(255, 255, 255);
        filter: brightness(0.9);
        transition: filter 0.3s, border-color 0.3s;
        animation: blinkFast 0.15s ease-in forwards;

        &:hover {
            cursor: pointer;
            border-color: rgba(240, 240, 240, 0.7);
            filter: brightness(1);
        }
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

    .login-selection-card, .settings-selection-card {
        background-color: rgba(0, 0, 0, 0.8);
    }

    .planner-selection-card {
        flex-direction: column;
        height: calc(#{$planner-card-height} - #{$vertical-gap});
        background-color: rgb(249, 154, 66);
        color: rgb(0, 0, 0);
        font-size: 2rem;

        span {
            z-index: 1;
        }

        .planner-icon {
            margin-top: -18.5%;
            width: 90%;
            height: 90%;
            background: rgb(0, 0, 0) url('../../assets/icons/sharpshooter_skull.svg') no-repeat center center/cover;
            transition: background-color 0.3s;

            &:hover {
                background-color: rgb(92, 24, 202);
            }
        }
    }

    .ongoing-selection-card {
        height: calc(100% - #{$planner-card-height});
        background-color: rgb(99, 80, 154);
    }

    .activities-selection-card {
        height: calc(#{$activities-card-height} - #{$vertical-gap} * 2);
    }

    .login-selection-card {
        position: relative;
        height: calc((100% - #{$activities-card-height}) * 0.6);

        .user-avatar {
            position: absolute;
            left: 7.5%;
            width: 2rem;
            height: 2rem;
        }
    }

    .settings-selection-card {
        height: calc((100% - #{$activities-card-height}) * 0.4);
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
