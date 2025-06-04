<template>
  <div v-if="data">
    <div class="px-4 py-2">
      <div class="flex justify-between items-center">
        <div>
          <div class="text-xl">中壢</div>
          <div class="text-sm text-gray-500">
            {{ decodeWeatherCode(data.current.weather_code) }}
          </div>
        </div>
        <p class="text-end text-xs text-gray-400 self-start">
          Last updated
          {{ DateTime.fromISO(data.current.time).toFormat('HH:mm') }}
        </p>
      </div>

      <div class="flex items-center py-2">
        <div class="flex-1">
          <div class="text-4xl">{{ data.current.temperature_2m }}&deg;C</div>
          <div class="text-gray-400 text-sm">
            {{ data.daily.temperature_2m_min[0] }} / {{ data.daily.temperature_2m_max[0] }}
          </div>
        </div>
        <div class="flex-1 flex justify-end">
          <icon :name="getWeatherIcon(data.current.weather_code)" size="7.5rem" />
        </div>
      </div>
    </div>
  </div>
<div v-else class="flex items-center justify-center h-full">
    <p class="text-zinc-500">Fetching weather data...</p>
</div>
</template>

<script setup>
import axios from 'axios';
import { DateTime } from 'luxon';

const data = ref(null)

const getWeather = async () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
            console.log("經度:", position.coords.longitude);
            console.log("緯度:", position.coords.latitude);
            },
            (error) => {
            console.error("取得位置失敗:", error.message);
            }
        );
        } else {
            console.error("此瀏覽器不支援地理位置功能");
        }
    const apiurl = "https://api.open-meteo.com/v1/forecast?latitude=24.9633&longitude=121.2403&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max&timezone=Asia%2FSingapore&forecast_days=3"
    const res = await axios.get(apiurl)
    data.value = res.data
    console.log(data.value)
}

const getPrecipitation = (d) => {
  return d.hourly.precipitation_probability.slice(0,24)
}

const weatherCodeIcons = {
  0: "meteocons:clear-day-fill",
  1: "meteocons:clear-day-fill",
  2: "meteocons:cloudy-fill",
  3: "meteocons:extreme-fill",
  45: "meteocons:fog-fill",
  48: "meteocons:fog-fill",
  51: "meteocons:drizzle-fill",
  53: "meteocons:drizzle-fill",
  55: "meteocons:drizzle-fill",
  56: "meteocons:snow-fill",
  57: "meteocons:snow-fill",
  61: "meteocons:rain-fill",
  63: "meteocons:rain-fill",
  65: "meteocons:rain-fill",
  66: "meteocons:snow-fill",
  67: "meteocons:snow-fill",
  71: "meteocons:snowflake-fill",
  73: "meteocons:snowflake-fill",
  75: "meteocons:snowflake-fill",
  77: "meteocons:snowflake-fill",
  80: "meteocons:extreme-rain-fill",
  81: "meteocons:extreme-rain-fill",
  82: "meteocons:extreme-rain-fill",
  85: "meteocons:snowflake-fill",
  86: "meteocons:snowflake-fill",
  95: "meteocons:thunderstorms-extreme-fill",
  96: "meteocons:snowflake-fill",
  99: "meteocons:snowflake-fill"
};

const getWeatherIcon = (weather) => {
    return weatherCodeIcons[weather] || 'meteocons:not-available-fill';
}

const weatherCodeDescriptions = {
  0: "晴朗",
  1: "晴朗",
  2: "多雲",
  3: "陰天",
  45: "霧",
  48: "霧凇",
  51: "小雨",
  53: "中雨",
  55: "大雨",
  56: "小凍雨",
  57: "大凍雨",
  61: "小雨",
  63: "中雨",
  65: "大雨",
  66: "小凍雨",
  67: "大凍雨",
  71: "小雪",
  73: "中雪",
  75: "大雪",
  77: "雪粒",
  80: "小陣雨",
  81: "中陣雨",
  82: "強陣雨",
  85: "小陣雪",
  86: "大陣雪",
  95: "輕度或中度雷陣雨",
  96: "輕度冰雹雷陣雨",
  99: "強冰雹雷陣雨"
};

function decodeWeatherCode(weatherCode) {
  return weatherCodeDescriptions[weatherCode] || "未知天氣代碼";
}

const getDirection = (angle) => {
    const directions = ["北", "東北", "東", "東南", "南", "西南", "西", "西北"];
    const index = Math.round(angle / 45) % 8;
    return directions[index];
}

onMounted(() => {
  getWeather()
})
</script>