<template>
    <div class="min-h-screen bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 px-4 py-8">
        <h1 class="text-3xl font-bold mb-4">Posts</h1>
        <Posts />
    </div>
</template>

<script setup lang="ts">
import Posts from '/components/posts.vue'

useHead({
    title: 'About',
    meta: [
        { name: 'description', content: 'Learn more about us and our mission.' },
        { property: 'og:title', content: 'About Us' },
        { property: 'og:description', content: 'Learn more about us and our mission.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: `https://yourdomain.com/about` },
        { property: 'og:image', content: '/images/about-og-image.jpg' }
    ]
})
</script>