<template>
    <div class="min-h-screen bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100">
        <div class="container mx-auto py-8">
            <NuxtLink class="mx-8 inline-flex gap-2 items-center" to="/posts">
                <Icon name="material-symbols:arrow-back" />
                Back to Posts
            </NuxtLink>
            <ContentRenderer class="space-y-4 mx-8 mt-8" :value="content" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const slug = route.params.slug

const content = await queryCollection('content').path(`/post/${slug}`).first()
</script>