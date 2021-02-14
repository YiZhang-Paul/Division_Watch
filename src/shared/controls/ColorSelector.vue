<template>
    <div class="color-selector-container">
        <span>{{ name }}</span>

        <div class="palette">
            <div class="row" v-for="n in 3" :key="n">
                <div class="option"
                    v-for="m in columns"
                    :key="m"
                    :class="{ 'selected-option': getColor(n, m) === selected }"
                    :style="{ 'background-color': getColor(n, m) }"
                    @click="$emit('select', getColor(n, m))">
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

class ColorSelectorProp {
    public name = prop<string>({ default: '' });
    public selected = prop<string>({ default: '' });
}

@Options({
    emits: ['select']
})
export default class ColorSelector extends Vue.with(ColorSelectorProp) {
    public readonly columns = 9;

    public readonly colors = [
        'rgb(255, 182, 193)',
        'rgb(229, 112, 126)',
        'rgb(255, 211, 105)',
        'rgb(255, 140, 0)',
        'rgb(255, 99, 71)',
        'rgb(255, 0, 0)',
        'rgb(199, 21, 133)',
        'rgb(255, 20, 147)',
        'rgb(255, 0, 255)',
        'rgb(128, 0, 128)',
        'rgb(138, 43, 226)',
        'rgb(128, 128, 0)',
        'rgb(0, 128, 0)',
        'rgb(32, 178, 70)',
        'rgb(0, 255, 127)',
        'rgb(152, 251, 152)',
        'rgb(0, 139, 139)',
        'rgb(0, 255, 255)',
        'rgb(221, 243, 245)',
        'rgb(135, 206, 235)',
        'rgb(30, 144, 255)',
        'rgb(65, 105, 225)',
        'rgb(25, 69, 107)',
        'rgb(105, 105, 105)',
        'rgb(169, 169, 169)',
        'rgb(201, 203, 255)',
        'rgb(255, 255, 255)'
    ];

    public getColor(row: number, column: number): string {
        return this.colors[(row - 1) * this.columns + column - 1];
    }
}
</script>

<style lang="scss" scoped>
.color-selector-container {
    $name-width: 45%;

    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 1.5% 3.5%;
    color: rgb(255, 255, 255);
    background-color: rgba(52, 51, 56, 0.8);
    font-family: 'Jost';

    & > span {
        align-self: baseline;
        margin-top: 0.1rem;
        width: $name-width;
        font-size: 0.5rem;
    }

    .palette {
        display: flex;
        flex-direction: column;
        width: calc(100% - #{$name-width});
        height: 100%;
        background-color: rgba(29, 29, 32, 0.8);

        .row {
            display: flex;
            justify-content: space-evenly;
            margin-top: 0.15rem;
            width: 100%;

            &:nth-last-child(1) {
                margin-bottom: 0.15rem;
            }

            .option {
                position: relative;
                width: 0.9rem;
                height: 0.9rem;
                border-radius: 5px;
                opacity: 0.75;
                transition: opacity 0.3s;
                overflow: hidden;

                &:hover, &.selected-option {
                    cursor: pointer;
                    opacity: 1;
                }

                &.selected-option::before, &.selected-option::after {
                    content: '';
                    position: absolute;
                    margin: auto;
                    top: 0.4rem;
                    left: 0.4rem;
                    width: 0.1rem;
                    height: 0.1rem;
                    border: 1px solid rgba(135, 135, 135, 0.6);
                    border-radius: 50%;
                    background-color: rgba(255, 255, 255, 0.35);
                }

                &.selected-option::before {
                    animation: expandCircle 2s ease infinite;
                }

                &.selected-option::after {
                    animation: expandCircle 2s ease 0.25s infinite;
                }
            }
        }
    }

    @keyframes expandCircle {
        0% {
            top: 0.4rem;
            left: 0.4rem;
            width: 0.1rem;
            height: 0.1rem;
            opacity: 1;
        }
        15% {
            opacity: 0.5;
        }
        25% {
            top: -0.15rem;
            left: -0.15rem;
            width: 1.2rem;
            height: 1.2rem;
            opacity: 0;
        }
        100% {
            opacity: 0;
        }
    }
}
</style>
