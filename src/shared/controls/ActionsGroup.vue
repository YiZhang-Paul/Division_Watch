<template>
    <div class="actions-group-container">
        <span :class="{ 'warning-text': isWarning }">{{ name }}</span>

        <div class="actions">
            <menu-button class="action"
                v-for="action of actions"
                :key="action.action"
                :class="{ 'warning-button': action.isWarning }"
                @click="$emit('action:selected', action.action)">

                {{ action.name }}
            </menu-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import { BasicAction } from '../../core/data-model/generic/basic-action';

import MenuButton from './MenuButton.vue';

class ActionsGroupProp {
    public name = prop<string>({ default: '' });
    public actions = prop<BasicAction<unknown>[]>({ default: [] });
    public isWarning = prop<boolean>({ default: false });
}

@Options({
    components: {
        MenuButton
    },
    emits: ['action:selected']
})
export default class ActionsGroup extends Vue.with(ActionsGroupProp) { }
</script>

<style lang="scss" scoped>
.actions-group-container {
    $name-width: 45%;

    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 1% 3.5%;
    color: rgb(255, 255, 255);
    background-color: rgba(52, 51, 56, 0.8);
    font-family: 'Jost';

    & > span {
        align-self: baseline;
        margin-top: 0.1rem;
        width: $name-width;
        font-size: 0.5rem;

        &.warning-text {
            color: rgb(233, 66, 54);
            font-weight: 600;
        }
    }

    .actions {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        width: calc(100% - #{$name-width});
        font-size: 0.875rem;

        .action {
            background-color: rgb(59, 163, 154);
            padding: 2px;

            &:not(:nth-last-child(1)) {
                margin-bottom: 1.5%;
            }
        }

        .warning-button {
            background-color: rgb(236, 33, 18);

            &:hover {
                background-color: rgb(240, 56, 42);
            }
        }
    }
}
</style>
