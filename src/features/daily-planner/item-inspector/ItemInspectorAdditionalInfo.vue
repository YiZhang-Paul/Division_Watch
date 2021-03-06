<template>
    <div class="item-inspector-additional-info-container">
        <div class="category">
            <component v-if="categoryIcon" class="icon" :is="categoryIcon"></component>
            <span>{{ category.name }}</span>
        </div>

        <div class="deadline">
            <template v-if="item.deadline || item.recur.some(_ => _)">
                <span v-if="item.deadline">Due on {{ deadline }}</span>
                <span v-if="!item.deadline">Occurs {{ recur }}</span>
                <span v-if="item.dueTime">&nbsp;by {{ dueTime }}</span>
            </template>

            <span v-if="!item.deadline && item.recur.every(_ => !_)">No deadline/recur specified.</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import store from '../../../store';
import { taskItemKey } from '../../../store/task-item/task-item.state';
import { categoryKey } from '../../../store/category/category.state';
// eslint-disable-next-line no-unused-vars
import { Category } from '../../../core/data-model/generic/category';
// eslint-disable-next-line no-unused-vars
import { TaskItem } from '../../../core/data-model/task-item/task-item';
import { GenericUtility } from '../../../core/utilities/generic/generic.utility';
import { TimeUtility } from '../../../core/utilities/time/time.utility';

class ItemInspectorAdditionalInfoProp {
    public item = prop<TaskItem>({ default: null });
}

@Options({

})
export default class ItemInspectorAdditionalInfo extends Vue.with(ItemInspectorAdditionalInfoProp) {

    get category(): Category | null {
        const id = this.parent ? this.parent.categoryId : this.item.categoryId;

        return store.getters[`${categoryKey}/category`](id);
    }

    get categoryIcon(): any {
        return GenericUtility.getIcon(this.category?.icon ?? '');
    }

    get parent(): TaskItem | null {
        if (!this.item.parent) {
            return null;
        }

        return store.getters[`${taskItemKey}/incompleteItem`](this.item.parent);
    }

    get deadline(): string {
        return this.item.deadline ? TimeUtility.toLongDateString(new Date(this.item.deadline)) : '';
    }

    get recur(): string {
        const include = this.item.recur.map((_, i) => _ ? i : -1).filter(_ => _ !== -1);

        if (include.length === 7) {
            return 'everyday';
        }
        else if (include.length === 1) {
            return `on ${TimeUtility.getDayOfWeek(include[0])}`;
        }

        const includeText = `on ${include.map(_ => TimeUtility.getDayOfWeek(_).slice(0, 3)).join(', ')}`;
        const exclude = this.item.recur.map((_, i) => _ ? -1 : i).filter(_ => _ !== -1);
        const excludeText = `everyday except ${exclude.map(_ => TimeUtility.getDayOfWeek(_).slice(0, 3)).join(', ')}`;

        return includeText.length <= excludeText.length ? includeText : excludeText;
    }

    get dueTime(): string {
        if (!this.item.dueTime) {
            return '';
        }

        return this.item.dueTime.split(':').map(_ => TimeUtility.prependZero(Number(_))).join(':');
    }
}
</script>

<style lang="scss" scoped>
.item-inspector-additional-info-container {

    .category {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        padding: 2% 3.5%;
        height: 66%;
        color: rgb(255, 255, 255);
        font-size: 0.6rem;

        .icon {
            margin-right: 2.5%;
            font-size: 0.85rem;
        }
    }

    .deadline {
        display: flex;
        align-items: flex-start;
        padding: 0 4.5%;
        height: 34%;
        color: rgb(255, 255, 255);
        font-size: 0.425rem;
        line-height: 0.425rem;
    }
}
</style>
