<template>
    <NuxtPage />
</template>

<script setup>
useHead({
	link: [
		{ rel: 'icon', type: 'image/png', href: '/cap.png' },
	]
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&family=Noto+Sans+TC:wght@100..900&family=Ultra&display=swap');

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