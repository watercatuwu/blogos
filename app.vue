<template>
    <NuxtPage />
</template>

<script setup>
const colorMode = useColorMode()

useHead({
  htmlAttrs: {
    class: colorMode.value
  }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Lexend:wght@100..900&family=Noto+Sans+TC:wght@100..900&display=swap');

.jetbrains-mono {
  font-family: "JetBrains Mono", monospace;
  font-optical-sizing: auto;
  font-style: normal;
}

body {
  font-family: 'lexend', 'Noto Sans TC', sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}
</style>