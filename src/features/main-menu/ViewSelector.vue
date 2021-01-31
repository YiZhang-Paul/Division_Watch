<template>
    <div class="view-selector-container">
        <div class="planner-view-card view-card"></div>
        <div class="ongoing-view-card view-card"></div>
        <div class="activities-view-card view-card"></div>
        <div class="login-view-card view-card"></div>
        <div class="settings-view-card view-card"></div>
        <div class="dashboard-view-card view-card"></div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

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

    .view-card {
        box-sizing: border-box;
        border: 2px solid rgba(195, 195, 195, 0.6);
        background-color: rgba(0, 0, 0, 0.45);
        box-shadow: 3px 3px 3px rgba(121, 121, 121, 0.25);
        filter: brightness(0.9);
        transition: filter 0.3s, border-color 0.3s;

        &:hover {
            cursor: pointer;
            border-color: rgba(240, 240, 240, 0.7);
            filter: brightness(1);
        }
    }

    .planner-view-card,
    .ongoing-view-card,
    .activities-view-card,
    .login-view-card,
    .settings-view-card {
        width: calc((100% - #{$horizontal-gap} * 2) * 0.32);
    }

    .planner-view-card, .ongoing-view-card {
        margin-right: $horizontal-gap;
    }

    .login-view-card, .settings-view-card {
        background-color: rgba(0, 0, 0, 0.8);
    }

    .planner-view-card {
        height: calc(#{$planner-card-height} - #{$vertical-gap});
        background-color: rgb(249, 154, 66);
    }

    .ongoing-view-card {
        height: calc(100% - #{$planner-card-height});
        background-color: rgb(99, 80, 154);
    }

    .activities-view-card {
        height: calc(#{$activities-card-height} - #{$vertical-gap} * 2);
    }

    .login-view-card {
        height: calc((100% - #{$activities-card-height}) * 0.6);
    }

    .settings-view-card {
        height: calc((100% - #{$activities-card-height}) * 0.4);
    }

    .dashboard-view-card {
        margin-left: $horizontal-gap;
        width: calc((100% - #{$horizontal-gap} * 2) * 0.36);
        height: 100%;
    }
}
</style>
