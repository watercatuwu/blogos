<template>
<div class="flex flex-col gap-2">
    <div v-for="(post, index) in posts" :key="index" class="flex">
        <div class="flex flex-col p-4 bg-zinc-300 dark:bg-zinc-700 rounded-l-lg shadow-md w-2/3 space-y-2">
            <a :target="isDesk ? '_blank' : '_self'" :href=post.path class="text-2xl hover:underline">{{ post.title }}</a>
            <p class="text-sm text-zinc-600 dark:text-zinc-400">{{ post.meta.date }}</p>
            <span class="text-sm text-zinc-600 dark:text-zinc-400">{{ post.meta.author }}</span>
            <p>{{ post.description }}</p>
            <div class="flex items-center gap-1">
                <span v-for="tag in post.meta.tags" class="text-sm bg-blue-500 text-white px-2 rounded-full">{{ tag }}</span>
            </div>
            <button v-if="isDesk" @click="$emit('addWidget',{id: post.path, isPost: true})" class="mt-auto flex items-center gap-1 rounded-full px-2 py-1 text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600 transition-colors cursor-pointer">
                <Icon name="material-symbols:new-window" />
                open in widget
            </button>
        </div>
        <div class="w-1/3 h-48 bg-cover bg-center rounded-r-lg shadow-md" :style="{ backgroundImage: `url(${post.meta.image})` }"></div>
    </div>
</div>
</template>

<script setup>
const posts = await queryCollection('content').all()

const { $emit } = useNuxtApp().$bus

const route = useRoute()
const href = route.href
const isDesk = href === '/desktop'
</script>