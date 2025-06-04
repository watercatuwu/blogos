<template>
<div class="w-full pointer-events-none">
  <nav class="h-16 mx-auto px-4 flex justify-between items-center bg-zinc-200 dark:bg-zinc-800 mt-2 rounded-t-xl shadow-md pointer-events-auto">
    <div class="w-48 flex-shrink-0 hidden md:block">
      <button class="w-16 h-16 flex justify-start items-center text-3xl hover:text-zinc-400 transition-colors cursor-pointer">
        <Icon name="material-symbols:apps" />
      </button>
    </div>
    
    <div class="flex items-center gap-2 mx-auto md:mx-0">
        <button
          v-for="link in links" 
          @click="$emit('addWidget', link.id)"
          class="flex items-center my-1 p-4 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-full transition-colors gap-2 cursor-pointer"
        >
          <Icon :name=link.icon />
          <span class="hidden md:block">{{link.name}}</span>
        </button>
    </div>

    <div class="w-48 flex-shrink-0 hidden md:block">
      <div class="flex justify-end">
        <div class="flex justify-center items-center rounded-full h-12 p-4 bg-zinc-100 dark:bg-zinc-900">
            <span class="text-md">{{ time }}</span>
        </div>
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
  { name: 'About', id: 'about', icon: 'material-symbols:info' },
  { name: 'Contact', id: 'contact', icon: 'material-symbols:mail' },
]

const time = ref(DateTime.now().setZone('Asia/Taipei').toFormat('HH:mm'))

onMounted(() => {
  setInterval(() => {
  time.value = DateTime.now().setZone('Asia/Taipei').toFormat('HH:mm')
}, 1000)
})
</script>

<style>
</style>