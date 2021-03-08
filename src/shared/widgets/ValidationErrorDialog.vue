<template>
    <dialog-panel :title="'Invalid transmission detected:'"
        :cancelText="''"
        :confirmText="'Got it'"
        :confirmHook="confirmHook"
        :isWarning="true">

        <div class="errors">
            <div v-for="(error, index) of data" :key="index">
                <pistol class="icon" />
                <span>{{ error }}</span>
            </div>
        </div>
    </dialog-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { Pistol } from 'mdue';

import DialogPanel from '../panels/DialogPanel.vue';

class ValidationErrorDialogProp {
    public data = prop<string[]>({ default: [] });
    public confirmHook = prop<(...args: any[]) => void>({ default: null });
}

@Options({
    components: {
        Pistol,
        DialogPanel
    }
})
export default class ValidationErrorDialog extends Vue.with(ValidationErrorDialogProp) { }
</script>

<style lang="scss" scoped>
.errors {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: flex-start;
    padding-top: 0.25rem;
    width: 100%;
    font-size: 0.45rem;
    opacity: 0;
    animation: revealContent 0.2s ease 0.5s forwards;

    & > div {
        display: flex;
        align-items: center;
        color: rgb(66, 250, 241);

        .icon {
            margin-top: 0.05rem;
            font-size: 0.4rem;
        }

        span {
            margin-left: 0.1rem;
        }
    }
}
</style>
