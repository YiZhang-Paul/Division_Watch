import axios from 'axios';

import { WeatherDescription } from '../../data-model/generic/weather-description';

export class WeatherService {
    private readonly api = 'https://api.openweathermap.org/data/2.5/weather';
    private readonly key = '7586edfa438deb8199bfc716132182a0';

    public async getWeatherByCity(city: string): Promise<WeatherDescription | null> {
        try {
            const { data } = await axios.get(`${this.api}?q=${city}&appid=${this.key}`);
            const { main, weather } = data;
            const temperature = Math.round(main.temp - 273.15);
            const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}.png`;

            return new WeatherDescription(temperature, iconUrl);
        }
        catch {
            return null;
        }
    }
}
