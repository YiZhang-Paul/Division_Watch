<template>
    <div class="section-panel-container" :style="{ '--title-size': isSubsection ? '0.475rem' : '0.85rem' }">
        <div class="side-guards">
            <div v-for="n in 3" :key="n"></div>
        </div>

        <div class="name" :class="{ editable: isEditable }" @click="onEditStart()">
            <template v-if="!isEditing && name">
                <span :class="{ subsection: isSubsection }">{{ name }}</span>
                <circle-edit-outline v-if="isEditable" class="edit-icon" />
            </template>

            <input type="text"
                v-if="isEditing || !name"
                ref="nameInput"
                class="edit-field"
                v-model="editedName"
                :placeholder="placeholder"
                @keyup.enter="onEditConfirm()"
                @keyup.esc="isEditing = !name"
                @blur="isEditing = !name" />
        </div>

        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { CircleEditOutline } from 'mdue';

class SectionPanelProp {
    public name = prop<string>({ default: '' });
    public placeholder = prop<string>({ default: 'type here...' });
    public isSubsection = prop<boolean>({ default: false });
    public isEditable = prop<boolean>({ default: false });
}

@Options({
    components: {
        CircleEditOutline
    },
    emits: ['name:edited']
})
export default class SectionPanel extends Vue.with(SectionPanelProp) {
    public editedName = this.name;
    public isEditing = !this.name;

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
        if (this.editedName) {
            this.isEditing = false;
            this.$emit('name:edited', this.editedName);
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

    .name {
        display: flex;
        align-items: center;
        align-self: flex-start;
        margin-left: $margin-left;
        opacity: 0;
        animation: revealContent 0.3s ease 1s forwards;
        transition: color 0.3s;

        span, .edit-field {
            padding: 1px 0.25rem 1px 0.2rem;
        }

        .edit-field {
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

        &.editable:hover {
            cursor: pointer;
            color: rgb(74, 236, 223);

            .edit-icon {
                color: rgb(74, 236, 223);
            }
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
        animation: revealContent 0.2s ease 1.2s forwards;
    }

    .side-guards {
        $top: calc(var(--title-size) * 0.75);
        $gap: 1.75%;
        $horizontal-guard-height: 2px;
        $vertical-guard-start-height: calc((100% - #{$gap}) / 3);
        $blink-duration: 0.3s;
        $blink-repeat: 2;

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
