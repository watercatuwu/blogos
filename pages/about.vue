<template>
    <div class="min-h-screen bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100">
        <div class="container py-8">
            <NuxtLink class="mx-8 inline-flex gap-2 items-center" to="/posts">
                <Icon name="material-symbols:arrow-back" />
                Back to Posts
            </NuxtLink>
            <ContentRenderer class="space-y-4 mt-8 mx-8 sm:mx-24 md:mx-48 lg:mx-64" :value="content" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const slug = route.params.slug

const content = await queryCollection('content').path(`/about`).first()

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