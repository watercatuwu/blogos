<template>
    <div class="text-zinc-800 dark:text-zinc-100 min-h-screen overflow-hidden">
        <div id="bg" class="absolute inset-0 bg-cover bg-left md:bg-center h-full -z-10"></div>
        <div class="absolute bottom-0 left-0 p-8 text-[6vw] overflow-hidden">
            <h1 class="en-titles leading-none select-none">Welcome to<br><span class="text-blue-400">Watercat's Blog</span></h1>
        </div>
        <div class="absolute bottom-0 left-0 p-8 text-[6vw] overflow-hidden">
            <h1 class="zh-titles leading-none select-none font-bold">歡迎&#8205;來到&#8205;<br>水貓&#8205;部落格</h1>
        </div>
        
        <div class="flex flex-col gap-4 items-end p-4">
            <div v-for="(link, index) in links" :key="index" :ref="el => linksRef[index] = el" class="group">
                <NuxtLink :to="link.href" class="select-none pb-2 flex justify-end text-end items-center gap-2 text-2xl md:text-3xl lg:text-4xl mr-4 md:mr-2 group-hover:mr-4 duration-500 ease-in-out group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-500 group-hover:bg-clip-text group-hover:text-transparent">
                    <Icon :name="link.icon" class="group-hover:text-cyan-500" />
                    {{ link.title }}
                </NuxtLink>
                <span class="select-none md:hidden group-hover:flex text-lg md:text-xl lg:text-2xl justify-end text-end items-center mr-4 duration-500 ease-in-out">
                    {{ link.description }}
                </span>
            </div>
        </div>

        <div class="absolute right-0 bottom-0">
            <div class="flex gap-2 items-center text-2xl md:text-3xl lg:text-4xl p-4 hover:text-cyan-400 duration-500 ease-in-out overflow-hidden">
                <a id="githubrepo" href="https://github.com/watercatuwu/blogos" target="_blank" rel="noopener noreferrer">
                    <Icon name="tabler:brand-github" />
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import gsap from 'gsap'
import SplitText from "gsap/SplitText";

console.log(SplitText)

const links = [
    { title:"BlogOS", description: "Try BlogOS(For Desktop)", href: "/desktop", icon: "material-symbols:desktop-windows" },
    { title:"About Me", description: "Learn more about me", href: "/about", icon: "material-symbols:info" },
    { title:"Posts", description: "See my posts", href: "/posts", icon: "material-symbols:article" }
]

const linksRef = []

useHead({
	title: "Watercat's Blog",
	meta: [
		{ name: 'description', content: "Explore my dream." },
		{ property: 'og:title', content: "Watercat's Blog" },
		{ property: 'og:description', content: "Explore my dream." },
		{ property: 'og:type', content: 'website' },
		{ property: 'og:url', content: `https://watercat.vercel.app` },
		{ property: 'og:image', content: '/preview.png' }
	]
})

onMounted(()=>{
    gsap.registerPlugin(SplitText) 

    let enSplit = SplitText.create(".en-titles", {
        type: "words",
        mask: "words",
        wordsClass: "title"
    })

    let zhSplit = SplitText.create(".zh-titles", {
        type: "words",
        mask: "words",
        wordsClass: "title",
        wordDelimiter: String.fromCharCode(8205)
    })

    const titleTL = gsap.timeline({repeat:-1})

    titleTL.from(enSplit.words, {
        yPercent: 120,
        stagger: 0.5,
        duration: 1,
    })

    titleTL.to(enSplit.words, {
        yPercent: -120,
        stagger: 0.5,
        duration: 1
    })

    titleTL.from(zhSplit.words, {
        yPercent: 120,
        stagger: 0.5,
        duration: 1,
    })

    titleTL.to(zhSplit.words, {
        yPercent: -120,
        stagger: 0.5,
        duration: 1
    })

    const tl =  gsap.timeline()

    tl.from(linksRef, {
        opacity: 0,
        x: 100,
        stagger: 0.25,
        duration: 1,
    })

    tl.from("#githubrepo", {
        opacity: 0,
        x: 100,
        duration: 1,
    })
})
</script>

<style scoped>
#bg {
	background-image: url("/nacho.png");
	filter: brightness(0.5);
}
</style>

<style>
.title{
    line-height: 1.2;
}
</style>