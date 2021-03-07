<template>
    <dialog-panel :title="'This item will be permanently deleted.'"
        :confirmText="'Delete'"
        :confirmHook="onConfirm"
        :isWarning="true">

        <div class="content">
            <span>{{ data.text }}</span>

            <option-dropdown class="option-dropdown"
                :useSimpleView="true"
                :options="data.options"
                :selected="transferCategory"
                :transform="data.transform"
                @options:select="transferCategory = $event">
            </option-dropdown>
        </div>
    </dialog-panel>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import { Category } from '../../../core/data-model/generic/category';
// eslint-disable-next-line no-unused-vars
import { DropdownOption } from '../../../core/data-model/generic/dropdown-option';
import DialogPanel from '../../../shared/panels/DialogPanel.vue';
import OptionDropdown from '../../../shared/controls/OptionDropdown.vue';

class DeleteCategoryDialogProp {
    public data = prop<DropdownOption<Category>>({ default: null });
    public confirmHook = prop<(...args: any[]) => void>({ default: null });
}

@Options({
    components: {
        DialogPanel,
        OptionDropdown
    }
})
export default class DeleteCategoryDialog extends Vue.with(DeleteCategoryDialogProp) {
    public transferCategory = this.data.selected ?? this.data.options[0];

    public onConfirm(): void {
        this.confirmHook(this.transferCategory);
    }
}
</script>

<style lang="scss" scoped>
.content {
    display: flex;
    align-items: center;
    height: 1rem;
    font-size: 0.45rem;
    opacity: 0;
    animation: revealContent 0.2s ease 0.5s forwards;

    span {
        margin-right: 0.25rem;
        filter: brightness(0.85);
        transition: filter 0.2s;
    }

    .option-dropdown {
        min-width: 5rem;
        height: 85%;
    }
}
</style>
