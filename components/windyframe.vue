<template>
    <iframe class="w-full h-full rounded-lg" :src="`https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=°C&metricWind=km/h&zoom=5&overlay=wind&product=ecmwf&level=surface&lat=${lat}&lon=${lon}&pressure=true&message=true`" frameborder="0"></iframe>
</template>
<script setup>
import axios from 'axios'

const lat = ref(0)
const lon = ref(0)

const getLocation = () => {
  if (!navigator.geolocation) {
    return
  }
  navigator.geolocation.getCurrentPosition(PositionSuccess, PosistionError)
}

const PositionSuccess = async (position) => {
  lat.value = position.coords.latitude
  lon.value = position.coords.longitude
}

const PosistionError = async (error) => {
  console.error(error)
  const { position, geterror } = await getLocationByIP()
  if (geterror) {
    console.error(geterror)
    return
  }
  lat.value = position.lat
  lon.value = position.lon
}

const getLocationByIP = async() => {
  const res = await axios.get("https://ipwho.is/")
  if (res.status!==200) {
      console.error(res.status, res.statusText)
      return {error: res.statusText}
  }
  return {position: {lat: res.data.latitude, lon: res.data.longitude}}
}

onMounted(()=>{
    getLocation()
})
</script>