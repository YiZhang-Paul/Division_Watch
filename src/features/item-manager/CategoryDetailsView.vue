<template>
    <div class="category-details-view-container">
        <input-panel class="input-item" :delay="0.3">
            <div class="category-name">
                <cloud-upload v-if="!category.id"
                    class="save-button"
                    @click="$emit('category:add', category)" />

                <input type="text"
                    :value="category.name"
                    @input="onCategoryChange('name', $event.target.value)"
                    placeholder="enter name here..." />
            </div>
        </input-panel>

        <input-panel class="edit-item" :delay="0.3">
            <div class="description">
                <span>Description</span>

                <textarea :value="category.description"
                    @input="onCategoryChange('description', $event.target.value)"
                    placeholder="enter description here..."
                    cols="30"
                    rows="12">
                </textarea>
            </div>
        </input-panel>

        <color-selector class="selector"
            :active="activeColor"
            :colors="colors"
            :delay="0.7"
            @color:select="onColorSelect($event)">
        </color-selector>

        <icon-selector class="selector"
            :active="category.icon"
            @icon:select="onCategoryChange('icon', $event)">
        </icon-selector>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { CloudUpload } from 'mdue';
// eslint-disable-next-line no-unused-vars
import { Color } from '../../core/data-model/color';
// eslint-disable-next-line no-unused-vars
import { Category } from '../../core/data-model/category';
import ColorSelector from '../../shared/inputs/ColorSelector.vue';
import IconSelector from '../../shared/inputs/IconSelector.vue';
import InputPanel from '../../shared/panels/InputPanel.vue';

class CategoryDetailsViewProp {
    public category = prop<Category>({ default: null });
}

@Options({
    components: {
        CloudUpload,
        ColorSelector,
        IconSelector,
        InputPanel
    },
    emits: [
        'category:add',
        'category:change',
        'category:update'
    ]
})
export default class CategoryDetailsView extends Vue.with(CategoryDetailsViewProp) {
    private updateDebounceTimer: NodeJS.Timeout | null = null;

    get activeColor(): Color | null {
        try {
            return Color.toColor(this.category.color);
        }
        catch {
            return null;
        }
    }

    get colors(): Color[] {
        return [
            new Color(216, 25, 25),
            new Color(33, 109, 224),
            new Color(30, 224, 62),
            new Color(218, 214, 22),
            new Color(228, 97, 22),
            new Color(28, 223, 213),
            new Color(113, 28, 223),
            new Color(223, 28, 142),
            new Color(255, 255, 255),
            new Color(80, 80, 80)
        ];
    }

    public beforeUnmount(): void {
        if (this.updateDebounceTimer) {
            this.$emit('category:update', this.category);
        }
    }

    public onColorSelect(color: Color): void {
        this.onCategoryChange('color', Color.toString(color));
    }

    public onCategoryChange(key: string, value: any): void {
        this.$emit('category:change', { ...this.category, [key]: value });

        if (this.updateDebounceTimer) {
            clearTimeout(this.updateDebounceTimer);
        }

        this.updateDebounceTimer = setTimeout(() => {
            this.$emit('category:update', this.category);
            this.updateDebounceTimer = null;
        }, 1000);
    }
}
</script>

<style lang="scss" scoped>
.category-details-view-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;

    .input-item, .edit-item, .selector {
        width: 85%;
    }

    .input-item, .selector {
        margin-top: 3%;
    }

    .edit-item {
        margin-top: 2%;
    }

    .category-name {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        padding: 1.5% 14%;
        color: rgb(255, 255, 255);
        background-color: rgba(63, 62, 68, 0.6);

        .save-button {
            position: absolute;
            left: calc(7% - 0.35rem);
            font-size: 0.7rem;
            filter: brightness(0.7);
            transition: filter 0.3s, color 0.3s;

            &:hover {
                cursor: pointer;
                color: rgb(43, 219, 43);
                filter: brightness(1);
            }
        }

        input {
            width: 100%;
            color: inherit;
            border: none;
            background-color: transparent;
            text-align: center;
            text-overflow: ellipsis;
            font-family: 'Segoe UI';
            font-size: 0.65rem;
            outline: none;

            &:focus::placeholder {
                color: transparent;
            }
        }
    }

    .description {
        display: flex;
        align-items: center;
        padding: 1.5% 4%;
        color: rgb(255, 255, 255);
        background-color: rgba(63, 62, 68, 0.6);

        & > span {
            align-self: flex-start;
            margin-top: 0.3rem;
            width: 35%;
            font-family: 'Bruno Ace';
            font-size: 0.475rem;
        }

        textarea {
            padding: 1%;
            width: 65%;
            max-width: 65%;
            border: none;
            color: rgb(255, 255, 255);
            background-color: rgba(74, 73, 82, 0.6);
            font-family: 'Segoe UI';
            resize: none;
            outline: none;
        }
    }
}
</style>
