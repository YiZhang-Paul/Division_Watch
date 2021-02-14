<template>
    <div v-if="category" class="category-summary-card-container" :class="{ 'active-card': isActive }">
        <div class="basic-information">
            <component v-if="categoryIcon"
                class="icon"
                :is="categoryIcon"
                :style="{ color: category.color }">
            </component>

            <span class="total-item">{{ totalItemsText }}</span>
        </div>

        <div class="detail-information">
            <div class="name-wrapper">
                <span class="name">{{ category.name }}</span>
            </div>

            <span class="description">{{ description }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import { Category } from '../../core/data-model/generic/category';
import { GenericUtility } from '../../core/utilities/generic/generic.utility';

class CategorySummaryCardProp {
    public category = prop<Category>({ default: null });
    public totalItems = prop<number>({ default: 0 });
    public isActive = prop<boolean>({ default: false });
}

export default class CategorySummaryCard extends Vue.with(CategorySummaryCardProp) {

    get categoryIcon(): any {
        return GenericUtility.getIcon(this.category?.icon ?? '');
    }

    get totalItemsText(): string {
        return `${this.totalItems} item${this.totalItems > 1 ? 's' : ''}`;
    }

    get description(): string {
        const description = this.category.description?.trim() ?? '';

        return description ? description : 'no description available.';
    }
}
</script>

<style lang="scss" scoped>
.category-summary-card-container {
    box-sizing: border-box;
    display: flex;
    background-color: rgba(36, 35, 38, 0.75);
    color: rgb(255, 255, 255);
    font-size: 0.6rem;
    transition: background-color 0.3s;

    &:hover {
        cursor: pointer;
        background-color: rgb(72, 66, 110);
    }

    &.active-card {
        background-color: rgb(29, 24, 44);

        .detail-information .name {
            color: rgb(247, 174, 18);
        }
    }

    .basic-information {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 25%;
        height: 100%;
        border-right: 1px solid rgba(255, 255, 255, 0.5);
        font-size: 1.25rem;

        .icon {
            opacity: 0;
            transition: color 0.2s;
            animation: revealContent 0.3s ease forwards;
        }

        .total-item {
            margin-top: 0.1rem;
            font-size: 0.4rem;
        }
    }

    .detail-information {
        display: flex;
        flex-direction: column;
        width: 75%;
        height: 100%;

        .name-wrapper {
            padding: 2% 4%;
            border-bottom: 1px solid rgba(255, 255, 255, 0.5);

            .name {
                transition: color 0.3s;
            }
        }

        .description {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            padding: 0.5% 4%;
            margin-top: 0.1rem;
            color: rgb(225, 225, 225);
            overflow: hidden;
            font-size: 0.425rem;
        }
    }
}
</style>
