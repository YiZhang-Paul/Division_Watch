<template>
    <input-panel :delay="0.3">
        <div class="content">
            <span>Danger Zone</span>

            <div class="confirmations">
                <confirm-panel class="confirmation"
                    :isWarning="true"
                    :displayText="'Delete Category'"
                    :confirmText="'Delete'"
                    @confirm:confirmed="$emit('category:delete', $event)">
                </confirm-panel>
            </div>
        </div>
    </input-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import InputPanel from '../../shared/panels/InputPanel.vue';
import ConfirmPanel from '../../shared/panels/ConfirmPanel.vue';

@Options({
    components: {
        InputPanel,
        ConfirmPanel
    },
    emits: ['category:delete']
})
export default class CategoryDangerZone extends Vue { }
</script>

<style lang="scss" scoped>
.content {
    display: flex;
    align-items: center;
    padding: 1.5% 4%;
    color: rgb(255, 255, 255);
    background-color: rgba(63, 62, 68, 0.6);

    & > span:first-of-type {
        align-self: flex-start;
        margin-top: 0.3rem;
        width: 47.5%;
        color: rgb(230, 23, 23);
        font-family: 'Bruno Ace';
        font-size: 0.475rem;
    }

    .confirmations {
        width: 52.5%;
    }
}
</style>
