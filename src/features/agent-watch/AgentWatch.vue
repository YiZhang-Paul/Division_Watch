<template>
    <div class="container">
        <watch-base></watch-base>
        <img class="logo" src="../../assets/shd_tech.jpg">
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

    .logo {
        $width: 37%;

        position: absolute;
        top: 5%;
        right: calc(50% - #{$width} / 2);
        width: $width;
    }
}
</style>
