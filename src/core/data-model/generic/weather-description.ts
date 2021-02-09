export class WeatherDescription {
    public temperature = 0;
    public iconUrl = '';

    constructor(temperature = 0, iconUrl = '') {
        this.temperature = temperature;
        this.iconUrl = iconUrl;
    }
}
