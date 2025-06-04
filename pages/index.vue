<template>
		<div class="bg-zinc-900 text-zinc-800 dark:text-zinc-100 min-h-screen flex flex-col">
			<div class="relative flex-grow border-zinc-800 border-2 rounded-xl overflow-auto flex flex-col w-full h-full">
				<div id="bg" class="absolute inset-0 bg-cover bg-center"></div>
				<Grid />
			</div>
			<Dock />
			<Toaster />
		</div>
</template>

<script setup>
import Grid from '/components/grid.vue'
import Dock from '/components/dock.vue'
import Toaster from '/components/toaster.vue'
</script>

<style scoped>
#bg {
	background-image: url("/nacho.png");
	filter: brightness(0.5);
}
</style>