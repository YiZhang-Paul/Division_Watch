<template>
    <display-panel class="menu-button-container"
        :class="{ disabled: isDisabled }"
        @mouseenter="onMouseenter()">

        <slot></slot>
    </display-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import store from '../../store';
import { soundKey } from '../../store/sound/sound.state';
import { SoundOption } from '../../core/data-model/generic/sound-option';
import DisplayPanel from '../panels/DisplayPanel.vue';
import { SoundType } from '../../core/enums/sound-type.enum';

class MenuButtonProp {
    public isDisabled = prop<boolean>({ default: false });
}

@Options({
    components: {
        DisplayPanel
    }
})
export default class MenuButton extends Vue.with(MenuButtonProp) {

    public onMouseenter(): void {
        store.dispatch(`${soundKey}/playSound`, new SoundOption('button_hover', SoundType.UI));
    }
}
</script>

<style lang="scss" scoped>
.menu-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: inherit;
    height: inherit;
    background-color: rgba(140, 140, 140, 0.25);
    transition: background-color 0.3s, color 0.3s;
    font-size: 0.6em;
    white-space: nowrap;

    &:hover {
        cursor: pointer;
        background-color: rgba(175, 175, 175, 0.35);
    }

    &:hover.disabled, &.disabled {
        cursor: default;
        color: rgb(65, 65, 65);
    }
}
</style>
