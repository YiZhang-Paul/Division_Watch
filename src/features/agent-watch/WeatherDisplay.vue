<template>
    <div v-if="weather" class="weather-display-container">
        <img :src="weather.iconUrl" />

        <div>
            <span>{{ placeholder }}</span>
            <span>{{ temperature }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

import { WeatherDescription } from '../../core/data-model/weather-description';
import { WeatherService } from '../../core/services/weather/weather.service';

const weatherService = new WeatherService();

export default class WeatherDisplay extends Vue {
    public weather = new WeatherDescription();

    get temperature(): string {
        const { temperature } = this.weather;
        const sign = temperature < 0 ? '-' : '';

        return Math.abs(temperature) < 10 ? `${sign}0${Math.abs(temperature)}` : String(temperature);
    }

    get placeholder(): number {
        return this.weather.temperature < 0 ? -88 : 88;
    }

    public created(): void {
        this.updateWeather();
    }

    private async updateWeather(): Promise<void> {
        this.weather = await weatherService.getWeatherByCity('mississauga') ?? this.weather;
        setTimeout(() => this.updateWeather(), 5 * 60 * 1000);
    }
}
</script>

<style lang="scss" scoped>
.weather-display-container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    img {
        position: absolute;
        bottom: 1.1em;
        width: 150%;
        filter: invert(75%) sepia(36%) saturate(1558%) hue-rotate(326deg) brightness(93%) contrast(88%);
    }

    div {
        margin-bottom: 0.25em;
        font-family: 'Digital Numbers';
        color: rgb(255, 255, 255);

        span:first-of-type {
            position: absolute;
            color: rgba(85, 85, 85, 0.3);
        }
    }
}
</style>
