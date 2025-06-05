<template>
    <div class="min-h-screen bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 px-4 py-8">
        <h1 class="text-3xl font-bold mb-4">Posts</h1>
        <Posts />
    </div>
</template>

<script setup lang="ts">
import Posts from '/components/posts.vue'

useHead({
    title: 'Posts',
    meta: [
        { name: 'description', content: 'My Posts' },
        { property: 'og:title', content: 'Posts' },
        { property: 'og:description', content: 'My Posts.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: `https://watercat.vercel.app/posts` },
        { property: 'og:image', content: '/cap.png' }
    ]
})
</script>