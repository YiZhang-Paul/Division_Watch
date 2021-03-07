<template>
    <div :id="id" class="dialog-panel-container glass-panel-light"></div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import VanillaTilt from 'vanilla-tilt';
import * as uuid from 'uuid';

import store from '../../store';
import { soundKey } from '../../store/sound/sound.state';
import { SoundOption } from '../../core/data-model/generic/sound-option';
import { SoundType } from '../../core/enums/sound-type.enum';

class DialogPanelProp {
    public title = prop<string>({ default: 'Are you sure?' });
    public confirmText = prop<string>({ default: 'Proceed' });
    public cancelText = prop<string>({ default: 'Cancel' });
}

@Options({
    emits: [
        'confirm',
        'cancel'
    ]
})
export default class DialogPanel extends Vue.with(DialogPanelProp) {
    public readonly id = `dialog-panel-${uuid.v4()}`;

    public mounted(): void {
        const container = document.querySelector(`#${this.id}`);
        VanillaTilt.init(container as HTMLElement, { max: 2, glare: true, 'max-glare': 0.1 });
        store.dispatch(`${soundKey}/playSound`, new SoundOption('panel_open', SoundType.UI));
    }
}
</script>

<style lang="scss" scoped>
.dialog-panel-container {
    min-width: 25vw;
    min-height: 22.5vh;
}
</style>
