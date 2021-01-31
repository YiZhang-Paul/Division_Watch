<template>
    <div class="activities-selection-card-container">
        <span class="title">Activities</span>
        <span class="message">tasks & interruptions</span>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class ActivitiesSelectionCard extends Vue { }
</script>

<style lang="scss" scoped>
.activities-selection-card-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    font-size: 0.8rem;

    .title {
        font-size: 2rem;
    }

    .message {
        color: rgb(215, 215, 215);
    }
}
</style>
