<template>
  <NuxtLink
    :href="props.href"
    :target="props.target"
    class="inline-flex gap-2 items-center text-base hover:scale-105 text-blue-600 dark:text-blue-400 transition-transform duration-200 ease-in-out"
  >
    <slot />
    <Icon name="material-symbols:link" />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  href: {
    type: String,
    default: ''
  },
  target: {
    type: String as PropType<'_blank' | '_parent' | '_self' | '_top' | (string & object) | null | undefined>,
    default: '_blank',
    required: false
  }
})
</script>
