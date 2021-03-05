<template>
    <div class="value-difference-container">
        <span>{{ name }}</span>

        <div class="content">
            <div class="values">
                <span>{{ valueTransform ? valueTransform(current) : current }}</span>

                <div v-if="difference"
                    class="difference"
                    :class="{ positive: current > target, negative: current < target }">

                    <arrow-up-bold v-if="current > target" class="arrow" />
                    <arrow-down-bold v-if="current < target" class="arrow" />
                    <span>{{ differenceTransform ? differenceTransform(difference) : difference }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { ArrowUpBold, ArrowDownBold } from 'mdue';

class ValueDifferenceProp {
    public name = prop<string>({ default: '' });
    public current = prop<number>({ default: 0 });
    public target = prop<number>({ default: 0 });
    public valueTransform = prop<(_: number) => string>({ default: null });
    public differenceTransform = prop<(_: number) => string>({ default: null });
}

@Options({
    components: {
        ArrowUpBold,
        ArrowDownBold
    }
})
export default class ValueDifference extends Vue.with(ValueDifferenceProp) {

    get difference(): number {
        return Math.abs(this.current - this.target);
    }
}
</script>

<style lang="scss" scoped>
.value-difference-container {
    $name-width: 45%;

    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 1% 3.5%;
    color: rgb(255, 255, 255);
    background-color: rgba(52, 51, 56, 0.55);
    border-left: 1px solid rgba(200, 200, 200, 0.4);
    border-right: 1px solid rgba(200, 200, 200, 0.4);
    font-family: 'Jost';

    & > span {
        width: $name-width;
        font-size: 0.5rem;
    }

    .content {
        display: flex;
        width: calc(100% - #{$name-width});

        .values {
            display: flex;
            align-items: center;
            padding: 1.35% 5.5%;
            width: 100%;
            height: 100%;
            border-radius: 3px;
            background-color: rgba(45, 45, 45, 0.7);
            font-size: 0.4rem;

            .difference {
                display: flex;
                align-items: center;
                margin-left: 0.175rem;

                &.positive {
                    color: rgb(81, 204, 70);
                }

                &.negative {
                    color: rgb(255, 45, 56);
                }

                .arrow {
                    font-size: 0.55rem;
                }
            }
        }
    }
}
</style>
