<template>
    <div class="weather-display-container">
        <img :src="weather.iconUrl" />
        <span>{{ temperature }}</span>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

import { WeatherDescription } from '../../../core/data-model/generic/weather-description';
import { WeatherService } from '../../../core/services/weather/weather.service';

const weatherService = new WeatherService();

export default class WeatherDisplay extends Vue {
    public weather = new WeatherDescription();

    get temperature(): string {
        const { temperature } = this.weather;
        const sign = temperature < 0 ? '-' : '';

        return Math.abs(temperature) < 10 ? `${sign}0${Math.abs(temperature)}` : String(temperature);
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
        width: 70%;
        height: 70%;
        filter: invert(75%) sepia(36%) saturate(1558%) hue-rotate(326deg) brightness(93%) contrast(88%);
    }

    span {
        margin-top: -17.5%;
        color: rgb(255, 255, 255);
        font-family: 'Play';
        font-size: 0.4rem;
    }
}
</style>
