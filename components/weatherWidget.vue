<template>
<div v-if="weatherData">
  <div class="p-4 flex flex-col gap-8 mb-12">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <Icon name="material-symbols:location-on-rounded" />
        <span v-if="geoInfo">{{ geoInfo.address.city }}, {{ geoInfo.address.country }}</span>
        <span v-if="!isGPS" class="text-sm text-zinc-600 dark:text-zinc-400">(概略)</span>
      </div>
      <div @click="updateWeather" class="flex items-center gap-2 cursor-pointer">
        <Icon name="material-symbols:refresh-rounded" />
        {{ DateTime.fromISO(weatherData.current.time).toFormat("H:mm") }}
      </div>
    </div>
    <div class="flex justify-between items-center bg-zinc-300 dark:bg-zinc-700 rounded-lg p-8">
      <div>
        <h1 class="text-5xl">
          {{ weatherData.current.temperature_2m }}
          {{  weatherData.current_units.temperature_2m }}
        </h1>
        <h2>{{ weatherCodeDescriptions[weatherData.current.weather_code] }}</h2>
        <div class="flex items-center">
          <Icon name="material-symbols:arrow-upward-alt-rounded" class="text-3xl text-red-400" />
          <p>{{ Math.max(...weatherData.hourly.temperature_2m) }}</p>
          <Icon name="material-symbols:arrow-downward-alt-rounded" class="text-3xl text-blue-400" />
          <p>{{ Math.min(...weatherData.hourly.temperature_2m) }}</p>
        </div>
      </div>
      <Icon :name="meteocons.default[weatherData.current.weather_code].fill.day" style="font-size: 10rem" />
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="flex text-lg justify-center items-center bg-zinc-300 dark:bg-zinc-700 rounded-lg py-8">
        <Icon name="meteocons:raindrop-fill" class="text-5xl" />
        <p>{{ weatherData.current.precipitation }}
          {{  weatherData.current_units.precipitation }}
        </p>
      </div>

      <div class="flex text-lg justify-center items-center bg-zinc-300 dark:bg-zinc-700 rounded-lg py-8">
        <Icon name="meteocons:humidity-fill" class="text-5xl" />
        <span>{{ weatherData.current.relative_humidity_2m }}
          {{  weatherData.current_units.relative_humidity_2m }}
        </span>
      </div>

      <div class="flex text-lg justify-center items-center bg-zinc-300 dark:bg-zinc-700 rounded-lg py-8">
        <Icon name="meteocons:wind" class="text-5xl" />
        <p>{{ weatherData.current.wind_speed_10m }}
          {{  weatherData.current_units.wind_speed_10m }}
        </p>
      </div>

      <div class="flex text-lg justify-center items-center bg-zinc-300 dark:bg-zinc-700 rounded-lg py-8">
        <Icon name="meteocons:thermometer-fill" class="text-5xl" />
        <p>
          {{ weatherData.current.apparent_temperature }}
          {{  weatherData.current_units.apparent_temperature }}
        </p>
      </div>

      <div class="flex text-lg justify-center items-center bg-zinc-300 dark:bg-zinc-700 rounded-lg py-8">
        <Icon name="meteocons:windsock" class="text-5xl" />
        <p>
          {{ getDirection(weatherData.current.wind_direction_10m) }}
          {{ weatherData.current.wind_direction_10m }}
          {{  weatherData.current_units.wind_direction_10m }}
        </p>
      </div>
    </div>
    <div>
      <h2 class="text-2xl mb-4">每小時預報</h2>
      <div class="flex flex-row overflow-x-auto">
        <div class="flex flex-col justify-center items-center flex-shrink-0 w-16 mx-2">
          <span class="text-sm text-zinc-600 dark:text-zinc-400">
            時間
          </span>
          <div style="height: 1.875rem;"></div>
          <span class="text-sm text-zinc-600 dark:text-zinc-400">
            氣溫
          </span>
          <span class="text-sm text-zinc-600 dark:text-zinc-400">
            降雨機率
          </span>
        </div>
        <div class="flex flex-col justify-center items-center w-48 p-4 rounded-lg" :class="index==0 ? ['bg-zinc-700'] : []" v-for="(item, index) in hourlyWeather(weatherData)" :key="index">
          <span class="text-sm">
            {{ DateTime.fromISO(item.time).toFormat("H:mm") }}
          </span>
          <Icon :name="meteocons.default[item.weather_code].fill.day" class="text-3xl" />
          <span class="text-sm">
            {{ item.temperature_2m }}{{  weatherData.hourly_units.temperature_2m }}
          </span>
          <span class="text-sm">
            {{ item.precipitation_probability }}{{  weatherData.hourly_units.precipitation_probability }}
          </span>
        </div>
      </div>
    </div>
    <div class="aspect-3/2">
      <h2 class="text-2xl mb-4">Windy</h2>
      <Windyframe />
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
import * as meteocons from '/assets/meteocons.json'

import Windyframe from './windyframe.vue';

const weatherData = ref(null)
const now = DateTime.now()
const geoInfo = ref(null)

const isGPS = ref(false)

const updateWeather = () => {
  if (!navigator.geolocation) {
    return
  }
  navigator.geolocation.getCurrentPosition(PositionSuccess, PosistionError)
}

const PositionSuccess = async (position) => {
  await getWeather(position.coords.latitude, position.coords.longitude)
  isGPS.value = true
}

const PosistionError = async (error) => {
  console.error(error)
  const { position, geterror } = await getLocationByIP()
  if (geterror) {
    console.error(geterror)
    return
  }
  await getWeather(position.lat, position.lon)
}

const getLocationByIP = async() => {
  const res = await axios.get("https://ipwho.is/")
  if (res.status!==200) {
      console.error(res.status, res.statusText)
      return {error: res.statusText}
  }
  console.log(res.data)
  return {position: {lat: res.data.latitude, lon: res.data.longitude}}
}

const reverseGeoCoding = async (lat, lon) => {
  const res = await axios.get("https://nominatim.openstreetmap.org/reverse",{
    params: {
      lat,
      lon,
      format: "json",
      "accept-language": "us"
    }
  })
  if (res.status!==200) {
    console.error(res.status, res.statusText)
    return
  }
  return res.data
}

const getWeather = async (latitude, longitude) => {
  const apiurl = "https://api.open-meteo.com/v1/forecast"
  const res = await axios.get(apiurl,  {
    params: {
      latitude,
      longitude,
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m",
      hourly: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code",
      daily: "temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max",
      timezone: "Asia/Taipei",
      forecast_days: 3
    }
  })
  if (res.status!==200) {
    console.error(res.status, res.statusText)
    return
  }
  weatherData.value = res.data
  console.log(weatherData.value)

  const geoRes = await reverseGeoCoding(weatherData.value.latitude, weatherData.value.longitude)
  geoInfo.value = geoRes
}

const weatherCodeDescriptions = {
  0: "晴朗",
  1: "晴朗",
  2: "多雲",
  3: "陰天",
  45: "霧",
  48: "霧凇",
  51: "毛毛雨",
  53: "中雨",
  55: "大雨",
  56: "小凍雨",
  57: "大凍雨",
  61: "小雨",
  63: "中雨",
  65: "大雨",
  66: "小凍雨",
  67: "大凍雨",
  71: "雪",
  73: "中雪",
  75: "大雪",
  77: "雪粒",
  80: "陣雨",
  81: "中陣雨",
  82: "強陣雨",
  85: "陣雪",
  86: "大陣雪",
  95: "雷陣雨",
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

// 為了防止在weatherData取得之前存取
const hourlyWeather = (weatherData) => {
  console.log(now.toSeconds())
  return weatherData.hourly.time
    .map((time, index)=>({
      time: time,
      temperature_2m: weatherData.hourly.temperature_2m[index],
      relative_humidity_2m: weatherData.hourly.relative_humidity_2m[index],
      apparent_temperature: weatherData.hourly.apparent_temperature[index],
      precipitation_probability: weatherData.hourly.precipitation_probability[index],
      weather_code: weatherData.hourly.weather_code[index]
    }))
    .filter((value)=>DateTime.fromISO(value.time).hour>=now.hour) // 未來預報
}

onMounted(() => {
  updateWeather()
})
</script>

<style scoped>
::-webkit-scrollbar {
	background-color: transparent;
	width: 8px;
	height: 8px;
}

::-webkit-scrollbar-thumb {
	background-color: rgb(63 63 70);
	border-radius: 4px;
}
</style>