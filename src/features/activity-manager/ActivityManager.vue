<template>
    <view-panel class="activity-manager-container"></view-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import ViewPanel from '../../shared/panels/ViewPanel.vue';

@Options({
    components: {
        ViewPanel
    }
})
export default class ActivityManager extends Vue { }
</script>

<style lang="scss" scoped>
.activity-manager-container {
}
</style>
