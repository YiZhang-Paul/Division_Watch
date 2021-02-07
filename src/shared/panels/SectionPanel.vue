<template>
    <div class="section-panel-container">
        <div class="side-guards">
            <div v-for="n in 3" :key="n"></div>
        </div>

        <div class="name" :class="{ editable: isEditable }" @click="onEditStart()">
            <template v-if="!isEditing">
                <span>{{ name }}</span>
                <circle-edit-outline v-if="isEditable" class="edit-icon" />
            </template>

            <input type="text"
                v-if="isEditing"
                ref="nameInput"
                class="edit-field"
                v-model="editedName"
                :placeholder="placeholder"
                @keyup.enter="onEditConfirm()"
                @keyup.esc="isEditing = false" />
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
    public isEditable = prop<boolean>({ default: false });
}

@Options({
    components: {
        CircleEditOutline
    },
    emits: ['name:edited']
})
export default class SectionPanel extends Vue.with(SectionPanelProp) {
    public isEditing = false;
    public editedName = this.name;

    public onEditStart(): void {
        this.isEditing = this.isEditable;

        if (this.isEditing) {
            setTimeout(() => (this.$refs.nameInput as any).focus());
        }
    }

    public onEditConfirm(): void {
        this.isEditing = false;
        this.$emit('name:edited', this.editedName);
    }
}
</script>

<style lang="scss" scoped>
.section-panel-container {
    $content-width: 85%;
    $margin-left: calc((100% - #{$content-width}) / 2);

    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    color: rgb(255, 255, 255);
    font-family: 'Jost';

    .name {
        display: flex;
        align-items: center;
        align-self: flex-start;
        margin-left: $margin-left;
        opacity: 0;
        animation: revealContent 0.3s ease 1s forwards;
        transition: color 0.3s;

        span, .edit-field {
            padding: 2px 0.25rem;
        }

        .edit-icon {
            margin-left: 0.25rem;
            color: rgb(241, 165, 78);
            font-size: 0.5rem;
            transition: color 0.3s;
        }

        .edit-field {
            outline: none;
            border: none;
            background-color: rgba(37, 34, 34, 0.3);
            color: rgb(255, 255, 255);
            font-family: 'Jost';
            font-size: 1rem;

            &::placeholder {
                font-size: 0.75rem;
                color: rgba(200, 200, 200, 0.7);
            }
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
        flex-direction: column;
        align-items: center;
        width: $content-width;
        opacity: 0;
        animation: revealContent 0.2s ease 1.2s forwards;
    }

    .side-guards {
        $top: 0.75rem;
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
            left: calc(55% + #{$gap} * 2);
            background-color: rgba(225, 225, 225, 0.8);
            opacity: 0;
        }

        & > div:nth-child(1) {
            top: calc((100% - #{$horizontal-guard-height}) / 2);
            width: 32.5%;
            height: $horizontal-guard-height;
            opacity: 1;
            animation: blinkFast $blink-duration ease forwards $blink-repeat,
                       moveGuard1 0.35s ease calc(#{$blink-duration} * #{$blink-repeat}) forwards;
        }

        & > div:nth-child(2) {
            top: calc(#{$gap} / 2 + #{$vertical-guard-start-height});
            left: calc(55% - #{$gap});
            width: 1px;
            height: $vertical-guard-start-height;
            background-color: rgba(225, 225, 225, 0.5);
            animation: revealContent 0.2s ease calc(#{$blink-duration} * #{$blink-repeat} + 0.25s) forwards,
                       expandGuard2 0.15s ease calc(#{$blink-duration} * #{$blink-repeat} + 0.2s) forwards;
        }

        & > div:nth-child(3) {
            top: calc((100% - #{$horizontal-guard-height}) / 2);
            width: 17.5%;
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
