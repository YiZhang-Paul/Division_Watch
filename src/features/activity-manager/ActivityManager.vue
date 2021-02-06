<template>
    <view-panel class="activity-manager-container">
        <template v-slot:footer>
            <div class="footer">
                <menu-button class="back-button" @click="backToMain()">Back</menu-button>
            </div>
        </template>
    </view-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import store from '../../store';
import { mainViewKey } from '../../store/main-view/main-view.state';
import { ViewOption } from '../../core/enums/view-option.enum';
import ViewPanel from '../../shared/panels/ViewPanel.vue';
import MenuButton from '../../shared/controls/MenuButton.vue';

@Options({
    components: {
        ViewPanel,
        MenuButton
    }
})
export default class ActivityManager extends Vue {

    public backToMain(): void {
        store.commit(`${mainViewKey}/setActiveView`, ViewOption.MainMenuNoop);
    }
}
</script>

<style lang="scss" scoped>
.activity-manager-container {
    .footer {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;

        .back-button {
            width: 6.5vw;
            height: 5vh;
            color: rgb(255, 255, 255);
        }
    }
}
</style>
