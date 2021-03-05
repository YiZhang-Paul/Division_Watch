<template>
    <div v-if="item" class="item-inspector-container">
        <div class="main-content"></div>

        <div class="footer-content">
            <menu-button class="register-button" @click="$emit('register:planned')">Mark Planned</menu-button>
            <menu-button class="register-button" @click="$emit('register:potential')">Mark Potential</menu-button>
            <menu-button class="cancel-button" @click="$emit('item:cancel')">Cancel</menu-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import store from '../../store';
import { soundKey } from '../../store/sound/sound.state';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../core/data-model/task-item/task-item';
import { SoundOption } from '../../core/data-model/generic/sound-option';
import MenuButton from '../../shared/controls/MenuButton.vue';
import { SoundType } from '../../core/enums/sound-type.enum';

class ItemInspectorProp {
    public item = prop<TaskItem>({ default: null });
}

@Options({
    components: {
        MenuButton
    },
    emits: [
        'register:planned',
        'register:potential',
        'item:cancel'
    ]
})
export default class ItemInspector extends Vue.with(ItemInspectorProp) {

    public mounted(): void {
        store.dispatch(`${soundKey}/playSound`, new SoundOption('tab_open', SoundType.UI));
    }
}
</script>

<style lang="scss" scoped>
.item-inspector-container {
    opacity: 0;
    animation: revealContent 0.2s ease 0.3s forwards;

    .main-content, .footer-content {
        display: flex;
        width: 100%;
    }

    .main-content {
        flex-direction: column;
        height: calc(100% - 2rem);
        background-color: lightblue;
    }

    .footer-content {
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        height: 2rem;
        opacity: 0;
        animation: revealContent 0.3s ease 0.5s forwards;

        .register-button, .cancel-button {
            margin-top: 1.5vh;
            height: 3.5vh;
        }

        .register-button {
            width: 8vw;
            color: rgb(240, 123, 14);
        }

        .cancel-button {
            width: 4.75vw;
            color: rgb(255, 255, 255);
        }
    }
}
</style>
