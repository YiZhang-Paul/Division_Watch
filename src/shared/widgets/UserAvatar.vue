<template>
    <div class="user-avatar-container">
        <help class="placeholder" />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Help } from 'mdue';

@Options({
    components: { Help }
})
export default class UserAvatar extends Vue { }
</script>

<style lang="scss" scoped>
.user-avatar-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 0.1rem solid rgb(230, 211, 237);
    background-color: rgb(140, 133, 218);

    .placeholder {
        font-size: 1.5rem;
    }
}
</style>
