<template>
    <view-panel v-if="item">
        <div class="main-content">

        </div>

        <template v-slot:footer>
            <div class="footer-content">
                <menu-button class="close-button" @click="$emit('item:close')">Close</menu-button>
            </div>
        </template>
    </view-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
import ViewPanel from '../../shared/panels/ViewPanel.vue';
import MenuButton from '../../shared/controls/MenuButton.vue';

class ItemInspectorProp {
    public item = prop<TaskItem>({ default: null });
}

@Options({
    components: {
        ViewPanel,
        MenuButton
    },
    emits: ['item:close']
})
export default class ItemInspector extends Vue.with(ItemInspectorProp) { }
</script>

<style lang="scss" scoped>
.footer-content {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;

    .close-button {
        width: 4.75vw;
        height: 3.5vh;
        color: rgb(255, 255, 255);
    }
}
</style>
