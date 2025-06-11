<template>
<div class="w-full relative">
  <!--App Menu-->
  <Transition name="appmenu">
  <div v-show="appMenuToggle" class="absolute bottom-18 left-0 w-84 h-96 p-8 z-50 bg-zinc-200 dark:bg-zinc-800 rounded-lg shadow-md">
    <div class="grid grid-cols-3 gap-8">
      <button v-for="app in apps" :key="app.id" @click="$emit('addWidget', {id: app.id, isPost: false})" class="p-2 w-full aspect-square flex flex-col gap-2 items-center justify-center rounded-lg cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700 duration-500 ease-in-out">
        <Icon :name="app.icon" class="text-2xl" />
        <span class="text-sm text-zinc-600 dark:text-zinc-400">{{ app.name }}</span>
      </button>
    </div>   
  </div>
  </Transition>

  <nav class="h-16 mx-auto px-4 flex justify-between items-center bg-zinc-200 dark:bg-zinc-800 mt-2 rounded-t-xl shadow-md pointer-events-auto">
    <div class="w-48 flex-shrink-0 hidden md:block">
      <button @click="appMenuToggle = !appMenuToggle" class="w-16 h-16 flex justify-start items-center text-3xl hover:text-zinc-400 transition-colors cursor-pointer">
        <Icon name="material-symbols:apps" />
      </button>
    </div>
    
    <div class="flex items-center gap-2 mx-auto md:mx-0">
        <button
          v-for="link in links" 
          @click="$emit('addWidget', {id: link.id, isPost: false})"
          class="flex items-center my-1 p-4 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-full gap-2 cursor-pointer duration-500 ease-in-out"
        >
          <Icon :name=link.icon />
          <span class="hidden md:block">{{link.name}}</span>
        </button>
    </div>

    <div class="w-48 flex-shrink-0 hidden md:block">
      <div class="flex gap-1 justify-end">
        <div class="flex justify-center items-center rounded-full h-12 p-4 bg-zinc-100 dark:bg-zinc-900">
            <span class="text-md">{{ time }}</span>
        </div>
        <button class="flex justify-center items-center rounded-full w-12 h-12 text-xl bg-red-400 dark:bg-red-600 transition-colors cursor-pointer">
           <Icon name="material-symbols:delete" />
        </button>
      </div>
    </div>
  </nav>
</div>
</template>

<script setup>
import { DateTime } from 'luxon'
import { ref, onMounted } from 'vue'

const { $emit } = useNuxtApp().$bus

const links = [
  { name: 'Posts', id: 'posts', icon: 'material-symbols:article' },
  { name: 'About', id: 'about', icon: 'material-symbols:info' }
]

const apps = [
  { name: 'YouTube', id: 'youtube', icon: 'logos:youtube-icon' },
  { name: 'Weather', id: 'weather', icon: 'material-symbols:cloud' },
  { name: 'Timer', id: 'timer', icon: 'material-symbols:alarm' },
  { name: 'Windy', id: 'windy', icon: 'tabler:brand-windy' }
]

const time = ref(DateTime.now().setZone('Asia/Taipei').toFormat('HH:mm'))
const isDark = ref(false)
const appMenuToggle = ref(false)

onMounted(() => {
  // 從 localStorage 讀取暗色模式設定
  const storedDarkMode = localStorage.getItem('isDark')
  isDark.value = storedDarkMode === 'true'
  document.documentElement.classList.toggle('dark', isDark.value)
  
  setInterval(() => {
    time.value = DateTime.now().setZone('Asia/Taipei').toFormat('HH:mm')
  }, 1000)
})
</script>

<style scoped>
.appmenu-enter-active,
.appmenu-leave-active {
  transition: opacity 0.4s, transform 0.4s;
}
.appmenu-enter-from,
.appmenu-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.appmenu-enter-to,
.appmenu-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>