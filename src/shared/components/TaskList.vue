<template>
    <glass-panel class="task-list-container">
        <input-panel class="task-node">
            <div class="node-content">
                <timer-sand class="icon" />
                <span>Tasks</span>
                <plus class="add-button" />
            </div>
        </input-panel>

        <input-panel class="interruption-node">
            <div class="node-content">
                <exclamation-thick class="icon" />
                <span>Interruptions</span>
                <plus class="add-button" />
            </div>
        </input-panel>

        <input-panel class="category-node">
            <div class="node-content">
                <format-list-bulleted-type class="icon" />
                <span>Categories</span>
                <plus class="add-button" />
            </div>
        </input-panel>
    </glass-panel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { ExclamationThick, FormatListBulletedType, Plus, TimerSand } from 'mdue';

import InputPanel from '../../shared/panels/InputPanel.vue';
import GlassPanel from '../../shared/panels/GlassPanel.vue';

@Options({
    components: {
        ExclamationThick,
        FormatListBulletedType,
        Plus,
        TimerSand,
        InputPanel,
        GlassPanel
    }
})
export default class TaskList extends Vue { }
</script>

<style lang="scss" scoped>
.task-list-container {

    .task-node,
    .interruption-node,
    .category-node {
        margin-top: 2px;
        width: 100%;
        height: 7%;
        max-height: 50px;

        .node-content {
            display: flex;
            align-items: center;
            padding: 0 0.75em;
            width: calc(100% - 1.5em);
            height: 100%;
            background-color: rgba(63, 62, 68, 0.6);
            color: rgba(255, 255, 255, 0.5);
            font-family: 'Segoe UI';
            font-size: 1.25em;
            transition: color 0.3s, filter 0.3s, background-color 0.2s;

            span:first-of-type {
                margin-left: 0.5em;
            }
        }

        .icon, .add-button {
            font-size: 1.4em;
            filter: brightness(0.7);
        }

        .add-button {
            margin-left: auto;
            color: rgb(246, 149, 78);
            opacity: 0;
            transition: filter 0.3s;

            &:hover {
                filter: brightness(1);
            }
        }

        &:hover {
            cursor: pointer;

            .node-content {
                background-color: rgb(63, 62, 68);
                color: rgb(255, 255, 255);
            }

            .icon {
                filter: brightness(1);
            }

            .add-button {
                opacity: 1;
            }
        }
    }

    .task-node {
        margin-top: 5px;

        .icon {
            color: rgb(255, 28, 82);
        }
    }

    .interruption-node .icon {
        color: rgb(0, 117, 255);
    }

    .category-node .icon {
        color: rgb(245, 238, 58);
    }
}
</style>
