<template>
  <div class="flex flex-col my-4">
    <div class="flex items-center justify-between bg-zinc-100 dark:bg-zinc-900 rounded-t-md px-4 py-2">
      <div class="flex items-center gap-2">
        <Icon v-if="$props.language" :name="`material-icon-theme:${ $props.language }`" />
        <Icon v-else name="material-symbols:code" />
        <span class="text-sm text-zinc-500" v-if="$props.filename">{{ $props.filename }}</span>
        <span class="text-sm text-zinc-500" v-else>{{ $props.language || 'Code' }}</span>
      </div>
      <button
        class="flex items-center text-sm text-zinc-400 hover:text-zinc-200 focus:outline-none cursor-pointer"
        @click="copyBtn"
      >
        <Icon name="material-symbols:content-copy-outline-rounded" />
        <span>copy</span>
      </button>
    </div>
    <div class="bg-zinc-50 dark:bg-zinc-950 rounded-b-md p-4">
      <pre :class="$props.class"><slot /></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  code: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: null
  },
  filename: {
    type: String,
    default: null
  },
  highlights: {
    type: Array as () => number[],
    default: () => []
  },
  meta: {
    type: String,
    default: null
  },
  class: {
    type: String,
    default: null
  }
})

const copyBtn = () => {
  const code = props.code
  if (code) {
    navigator.clipboard.writeText(code).then(() => {
      console.log('Code copied to clipboard')
    }).catch(err => {
      console.error('Failed to copy code: ', err)
    })
  } else {
    console.warn('No code to copy')
  }
}
</script>

<style>
pre code .line {
  display: block;
}
</style>
