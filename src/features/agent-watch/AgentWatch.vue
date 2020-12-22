<template>
    <div class="container">
        <watch-base></watch-base>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import WatchBase from '../../shared/WatchBase.vue';

@Options({
    components: {
        WatchBase
    }
})
export default class AgentWatch extends Vue { }
</script>

<style lang="scss" scoped>
.container {
    border-radius: 50%;
}
</style>
