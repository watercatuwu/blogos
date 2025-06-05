<template>
    <div class="flex flex-col gap-4">
        <div class="flex justify-center items-center gap-2">
            <input :disabled="isRunning" type="number" class="text-3xl w-full text-center" min="0" max="59" v-model="timerHour" @input="validateInput" />
            <input :disabled="isRunning" type="number" class="text-3xl w-full text-center" min="0" max="59" v-model="timerMin" @input="validateInput" />
            <input :disabled="isRunning" type="number" class="text-3xl w-full text-center" min="0" max="59" v-model="timerSec" @input="validateInput" />
        </div>
        <div class="flex justify-center items-center gap-2">
            <button @click="addMinutes(3)" :disabled="isRunning" :class="isRunning ? ['text-zinc-600 dark:text-zinc-400 cursor-not-allowed']:['hover:bg-zinc-200 dark:hover:bg-zinc-600 cursor-pointer']" class="py-1 px-2 text-sm bg-zinc-300 dark:bg-zinc-700 rounded-full">🍜fast noodles</button>
            <button @click="addMinutes(5)" :disabled="isRunning" :class="isRunning ? ['text-zinc-600 dark:text-zinc-400 cursor-not-allowed']:['hover:bg-zinc-200 dark:hover:bg-zinc-600 cursor-pointer']" class="py-1 px-2 text-sm bg-zinc-300 dark:bg-zinc-700 rounded-full">+5:00</button>
            <button @click="addMinutes(30)" :disabled="isRunning" :class="isRunning ? ['text-zinc-600 dark:text-zinc-400 cursor-not-allowed']:['hover:bg-zinc-200 dark:hover:bg-zinc-600 cursor-pointer']" class="py-1 px-2 text-sm bg-zinc-300 dark:bg-zinc-700 rounded-full">+30:00</button>
        </div>
        <div class="flex justify-center items-center gap-4">
            <button @click="resetTimer" class="flex justify-center items-center p-2 bg-red-500 hover:bg-red-600 cursor-pointer text-white text-2xl rounded-full">
                <Icon name="material-symbols:stop-rounded" />
            </button>
            <button @click="pauseTimer" class="flex justify-center items-center p-2 bg-zinc-400 hover:bg-zinc-300 dark:bg-zinc-600 dark:hover:bg-zinc-700 cursor-pointer text-white text-2xl rounded-full">
                <Icon name="material-symbols:pause-rounded" />
            </button>
            <button @click="startTimer" class="flex justify-center items-center p-2 bg-green-500 hover:bg-green-600 cursor-pointer text-white text-2xl rounded-full">
                <Icon name="material-symbols:play-arrow-rounded" />
            </button>
        </div>
    </div>
</template>

<script setup>
const timerHour = ref(0)
const timerMin = ref(0)
const timerSec = ref(0)

let timer = null
const isRunning = ref(false)

const addMinutes = (qty) => {
    if (timerMin.value + qty > 59){
        timerMin.value = timerMin.value + qty - 60
        timerHour.value += 1
    } else {
        timerMin.value += qty
    }
}

const resetTimer = () => {
    timerHour.value = 0
    timerMin.value = 0
    timerSec.value = 0
    if (timer) {
        clearInterval(timer)
        timer = null
        isRunning.value = false
    }
}

const pauseTimer = () => {
    if (timer) {
        clearInterval(timer)
        timer = null
        isRunning.value = false
    }
    console.log("Timer paused")
}

const startTimer = () => {
    isRunning.value = true
    let totalSeconds = 0
    totalSeconds += parseInt(timerHour.value) * 3600
    totalSeconds += parseInt(timerMin.value) * 60
    totalSeconds += parseInt(timerSec.value)
    console.log(totalSeconds)

    timer = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--
            timerHour.value = Math.floor(totalSeconds / 3600)
            timerMin.value = Math.floor((totalSeconds % 3600) / 60)
            timerSec.value = totalSeconds % 60
        } else {
            clearInterval(timer)
            timer = null
            isRunning.value = false
            console.log("Timer finished")
        }
    }, 1000)
}

const validateInput = () => {
    if (timerSec.value < 0 || timerSec.value > 59 || Number.isNaN(timerSec.value)) {
        timerSec.value = 59
        return false
    } else if (timerMin.value < 0 || timerMin.value > 59 || Number.isNaN(timerMin.value)) {
        timerMin.value = 59
        return false
    } else if (timerHour.value < 0 || timerHour.value > 59 || Number.isNaN(timerHour.value)) {
        timerHour.value = 59
        return false
    } else {
        timerSec.value = parseInt(timerSec.value)
        timerMin.value = parseInt(timerMin.value)
        timerHour.value = parseInt(timerHour.value)
        return true
    }
}

onUnmounted(() => {
    resetTimer()
})

</script>