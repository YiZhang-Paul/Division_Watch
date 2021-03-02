<template>
    <div class="value-difference-container">
        <span>{{ name }}</span>

        <div class="content">
            <div class="difference">
                <span>{{ valueTransform ? valueTransform(current) : current }}</span>

                <span v-if="difference">
                    {{ differenceTransform ? differenceTransform(difference) : difference }}
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

class ValueDifferenceProp {
    public name = prop<string>({ default: '' });
    public current = prop<number>({ default: 0 });
    public target = prop<number>({ default: 0 });
    public valueTransform = prop<(_: number) => string>({ default: null });
    public differenceTransform = prop<(_: number) => string>({ default: null });
}

@Options({

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
        justify-content: center;
        width: calc(100% - #{$name-width});

        .difference {
            padding: 1.35% 5.5%;
            width: 100%;
            height: 100%;
            border-radius: 3px;
            background-color: rgba(45, 45, 45, 0.7);
            font-size: 0.4rem;
        }
    }
}
</style>
