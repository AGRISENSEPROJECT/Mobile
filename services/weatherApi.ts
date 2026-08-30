import ENV from '@/config/env';
import axios from 'axios';

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

function openWeatherParams(lat: number, lon: number) {
    if (!ENV.OPENWEATHER_API_KEY) {
        throw new Error('Missing EXPO_PUBLIC_OPENWEATHER_API_KEY in .env');
    }

    return {
        lat,
        lon,
        appid: ENV.OPENWEATHER_API_KEY,
        units: 'metric',
    };
}

export function getCurrentWeather(lat: number, lon: number) {
    return axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
        params: openWeatherParams(lat, lon),
        timeout: 10000,
    });
}

export function getWeatherForecast(lat: number, lon: number) {
    return axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
        params: openWeatherParams(lat, lon),
        timeout: 10000,
    });
}
