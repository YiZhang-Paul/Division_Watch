<template>
    <div v-if="item" class="checklist-card-container">
        <span>{{ item.description }}</span>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import { ChecklistItem } from '../../core/data-model/task-item/checklist-item';

class ChecklistCardProp {
    public item = prop<ChecklistItem>({ default: null });
}

@Options({

})
export default class ChecklistCard extends Vue.with(ChecklistCardProp) { }
</script>

<style lang="scss" scoped>
.checklist-card-container {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding-left: 2.5%;
    padding-right: 5%;
    max-height: 7.5vh;
    background-color: rgba(36, 35, 38, 0.8);
    transition: background-color 0.3s;

    &:hover {
        cursor: pointer;
        background-color: rgb(72, 66, 110);
    }

    & > span {
        margin-left: 1%;
    }
}
</style>
