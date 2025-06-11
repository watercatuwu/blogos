<template>
    <div class="text-zinc-800 dark:text-zinc-100 min-h-screen max-h-screen">
        <div id="bg" class="absolute inset-0 bg-cover bg-center h-full -z-10"></div>
        <h1 class="absolute bottom-0 left-4 text-[10vw] leading-none pb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Welcome to<br>Watercat's Blog</h1>
        
        <div class="flex flex-col gap-4 items-end p-4">
            <h2 class="text-3xl md:text-5xl">You can</h2>
            <NuxtLink v-for="link in links" :to="link.href" class="flex items-center gap-2 md:text-xl hover:text-baseline mr-2 hover:mr-4 duration-200 ease-in-out">
                <Icon :name="link.icon" />
                {{ link.content }}
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
const links = [
    { href: "/desktop", content: "Try BlogOS(Desktop)", icon: "material-symbols:desktop-windows" },
    { href: "/about", content: "Learn more about me", icon: "material-symbols:info" }
]

useHead({
	title: "Watercat's Blog",
	meta: [
		{ name: 'description', content: "Discover my dream." },
		{ property: 'og:title', content: "Watercat's Blog" },
		{ property: 'og:description', content: "Discover my dream." },
		{ property: 'og:type', content: 'website' },
		{ property: 'og:url', content: `https://watercat.vercel.app` },
		{ property: 'og:image', content: '/cap.png' }
	]
})
</script>

<style scoped>
#bg {
	background-image: url("/nacho.png");
	filter: brightness(0.5);
}
</style>