<template>
    <div class="section-panel-container" :style="{ '--title-size': isSubsection ? '0.475rem' : '0.85rem' }">
        <div class="side-guards">
            <div v-for="n in 3" :key="n"></div>
        </div>

        <div v-if="hasError || hasUnsavedChange" class="error">
            <pistol class="error-icon" />
            <span>{{ errorMessage }}</span>
        </div>

        <div class="name" :class="nameWrapperStyle" @click="onEditStart()">
            <template v-if="!isEditing && !hasError">
                <span class="dummy-display">placeholder</span>

                <div class="name-display">
                    <span :class="{ subsection: isSubsection }">{{ name }}</span>
                    <circle-edit-outline v-if="isEditable && name" class="edit-icon" />
                </div>
            </template>

            <input type="text"
                v-if="isEditing || hasError"
                ref="nameInput"
                class="edit-field"
                v-model="editedName"
                :placeholder="placeholder"
                :maxlength="maxLength"
                @input="$emit('name:input', $event.target.value)"
                @keyup.enter="onEditConfirm()"
                @keyup.esc="onCancel()"
                @blur="onEditConfirm()" />
        </div>

        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { CircleEditOutline, Pistol } from 'mdue';

class SectionPanelProp {
    public name = prop<string>({ default: '' });
    public placeholder = prop<string>({ default: 'type here...' });
    public errorText = prop<string>({ default: '' });
    public maxLength = prop<number>({ default: 40 });
    public isSubsection = prop<boolean>({ default: false });
    public isEditable = prop<boolean>({ default: false });
}

@Options({
    components: {
        CircleEditOutline,
        Pistol
    },
    emits: [
        'name:edited',
        'name:input'
    ]
})
export default class SectionPanel extends Vue.with(SectionPanelProp) {
    public editedName = this.name;
    public isEditing = !this.name;

    get hasError(): boolean {
        return !this.editedName?.trim() || Boolean(this.errorText);
    }

    get hasUnsavedChange(): boolean {
        return !this.name && Boolean(this.editedName?.trim());
    }

    get errorMessage(): string {
        if (!this.editedName?.trim()) {
            return 'name must not be empty.';
        }

        if (this.errorText) {
            return this.errorText;
        }

        return this.hasUnsavedChange ? 'change unsaved.' : '';
    }

    get nameWrapperStyle(): { [key: string]: boolean } {
        return {
            editable: this.isEditable,
            invalid: this.hasError || this.hasUnsavedChange,
            unsaved: this.hasUnsavedChange && !this.hasError
        };
    }

    public mounted(): void {
        this.tryFocusInput();
    }

    public onEditStart(): void {
        this.isEditing = this.isEditable;

        if (this.isEditing) {
            this.tryFocusInput();
        }
    }

    public onEditConfirm(): void {
        if (!this.isEditing) {
            return;
        }

        const name = this.editedName?.trim();

        if (!name || this.hasError) {
            return;
        }

        this.isEditing = false;

        if (name !== this.name) {
            this.$emit('name:edited', name);
        }
    }

    public onCancel(): void {
        if (this.isEditing) {
            this.isEditing = !this.name;
            this.editedName = this.name;
            this.$emit('name:input', this.editedName);
        }
    }

    private tryFocusInput(): void {
        setTimeout(() => {
            if (this.$refs.nameInput) {
                (this.$refs.nameInput as any).focus();
            }
        });
    }
}
</script>

<style lang="scss" scoped>
.section-panel-container {
    $margin-left: 0.75rem;
    $content-width: calc(100% - #{$margin-left});

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: relative;
    color: rgb(255, 255, 255);
    font-family: 'Jost';
    font-size: var(--title-size);

    .error {
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 100%;
        left: $margin-left;
        color: rgb(66, 250, 241);
        font-size: calc(var(--title-size) * 0.6);

        .error-icon {
            margin-top: 0.085rem;
            margin-right: 0.15rem;
            font-size: calc(var(--title-size) * 0.55);
            opacity: 0;
            animation: revealContent 0.01s ease 0.4s forwards,
                       blinkFast 0.2s ease 0.4s forwards;
        }

        & > span {
            opacity: 0;
            animation: revealContent 0.25s ease 0.5s forwards;
        }
    }

    .name {
        display: flex;
        align-items: center;
        align-self: flex-start;
        position: relative;
        margin-left: $margin-left;
        width: $content-width;
        border: 1px solid transparent;
        opacity: 0;
        animation: revealContent 0.3s ease 0.3s forwards;
        transition: color 0.3s;

        .dummy-display {
            visibility: hidden;
        }

        .name-display {
            display: flex;
            align-items: center;
            position: absolute;
            top: 0;
            left: 0;
        }

        span, .edit-field {
            padding: 1px 0.25rem 1px 0.2rem;
        }

        .edit-field {
            width: 100%;
            outline: none;
            border: none;
            background-color: rgba(37, 34, 34, 0.3);
            color: rgb(255, 255, 255);
            font-family: 'Jost';
            font-size: var(--title-size);

            &::placeholder {
                font-size: 0.75rem;
                color: rgba(200, 200, 200, 0.7);
            }
        }

        .edit-icon {
            color: rgb(241, 165, 78);
            font-size: 0.475rem;
            transition: color 0.3s;
        }

        &.invalid {
            border: 1px solid rgb(66, 250, 241);
            transition: color 0.3s, border 0.3s 0.2s;

            &:not(.unsaved) .edit-field {
                color: rgb(255, 20, 51);
            }
        }

        &.editable:hover {
            cursor: pointer;
            color: rgb(241, 165, 78);
        }
    }

    .content {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        margin-top: 1.25%;
        margin-left: $margin-left;
        width: $content-width;
        opacity: 0;
        animation: revealContent 0.2s ease 0.4s forwards;
    }

    .side-guards {
        $top: calc(var(--title-size) * 0.75);
        $gap: 1.75%;
        $horizontal-guard-height: 2px;
        $vertical-guard-start-height: calc((100% - #{$gap}) / 3);
        $blink-duration: 0.15s;
        $blink-repeat: 1;

        position: absolute;
        top: $top;
        left: 0;
        width: $margin-left;
        height: calc(97.5% - #{$top});

        & > div {
            position: absolute;
            left: calc(25% + #{$gap} * 2);
            background-color: rgba(225, 225, 225, 0.8);
            opacity: 0;
        }

        & > div:nth-child(1) {
            top: calc((100% - #{$horizontal-guard-height}) / 2);
            width: 72.5%;
            height: $horizontal-guard-height;
            opacity: 1;
            animation: blinkFast $blink-duration ease forwards $blink-repeat,
                       moveGuard1 0.35s ease calc(#{$blink-duration} * #{$blink-repeat}) forwards;
        }

        & > div:nth-child(2) {
            top: calc(#{$gap} / 2 + #{$vertical-guard-start-height});
            left: calc(25% - #{$gap});
            width: 1px;
            height: $vertical-guard-start-height;
            background-color: rgba(225, 225, 225, 0.5);
            animation: revealContent 0.2s ease calc(#{$blink-duration} * #{$blink-repeat} + 0.25s) forwards,
                       expandGuard2 0.15s ease calc(#{$blink-duration} * #{$blink-repeat} + 0.2s) forwards;
        }

        & > div:nth-child(3) {
            top: calc((100% - #{$horizontal-guard-height}) / 2);
            width: 45%;
            height: $horizontal-guard-height;
            animation: revealContent 0.01s ease calc(#{$blink-duration} * #{$blink-repeat}) forwards,
                       moveGuard3 0.35s ease calc(#{$blink-duration} * #{$blink-repeat}) forwards;
        }

        @keyframes moveGuard1 {
            from { top: calc((100% - #{$horizontal-guard-height}) / 2) }
            to { top: 0 }
        }

        @keyframes expandGuard2 {
            from {
                top: calc((100% - #{$horizontal-guard-height}) / 2);
                height: $vertical-guard-start-height;
            }
            to {
                top: calc(#{$gap} / 2);
                height: calc(100% - #{$gap});
            }
        }

        @keyframes moveGuard3 {
            from { top: calc((100% - #{$horizontal-guard-height}) / 2) }
            to { top: calc(100% - #{$horizontal-guard-height}) }
        }
    }
}
</style>
