<template>
    <ContentRenderer class="space-y-4 mx-8" :value="content" />
</template>

<script setup lang="ts">
const props = defineProps<{
  path: string
}>()
const content = await queryCollection('content').path(props.path).first()
</script>