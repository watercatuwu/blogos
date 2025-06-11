<template>
<div :id="playerID" class="w-full aspect-video rounded-lg"></div>
<div class="flex flex-col h-full my-2 gap-2">
    <div class="flex flex-col w-full">
        <button @click="menuToggle=!menuToggle" :class="!menuToggle?['rounded-b-lg']:[]" class="flex justify-center items-center text-2xl w-full bg-zinc-300 dark:bg-zinc-700 rounded-t-lg cursor-pointer">
            <Icon v-show="menuToggle" name="material-symbols:arrow-drop-up-rounded" />
            <Icon v-show="!menuToggle" name="material-symbols:arrow-drop-down-rounded" />
        </button>
        <div v-show="menuToggle" class="flex flex-col gap-2">
            <div class="inline-flex rounded-b-lg bg-zinc-300 dark:bg-zinc-700">
                <input v-model="inputValue" @keyup.enter="updateYoutubeIframe" class="w-full jetbrains-mono p-2" :placeholder="inputPlaceholder" />
                <button @click="updateYoutubeIframe" class="w-8 flex items-center justify-center cursor-pointer">
                    <Icon name="material-symbols:send" />
                </button>
            </div>
        </div>
    </div>
    <div class="flex-1 overflow-y-auto">
        <div class="flex flex-col gap-2">
            <div @click="nowPlayingID=item.snippet.resourceId.videoId" v-for="item in playList" :key=item.snippet.resourceId.videoId :class="(nowPlayingID === item.snippet.resourceId.videoId) ? ['border-2 border-zinc-800 dark:border-zinc-200'] : []" class="flex bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600 h-24 rounded-lg duration-500 ease-in-out cursor-pointer">
                <div class="p-1 flex gap-2">
                    <img class="h-full rounded-lg" :src=item.snippet.thumbnails.maxres.url />
                    <div>
                        <h1 class="text-lg break-normal">{{ item.snippet.title }}</h1>
                        <p class="text-sm text-zinc-600 dark:text-zinc-400">{{ item.snippet.videoOwnerChannelTitle }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
import YouTubePlayer from 'youtube-player'

const nowPlayingID = ref("eKo6yEE3oCA")
const playList = ref([])
const inputValue = ref("https://www.youtube.com/playlist?list=PLzOIH4uKYiaN5lzNcqlE-yGBj19iK6ZUU")
const inputPlaceholder = ref("Youtube Video or Playlist URL")
const menuToggle = ref(false)

let player
const playerID = `player${Date.now()}`

onMounted(()=>{
    player = YouTubePlayer(playerID, {
        videoId: nowPlayingID.value,
        width: 0,
        height: 0
    });

    updateYoutubeIframe()

    player.on('stateChange', (event) => {
        if (playList.value.length>0) {
            if (event.data == 0) {
                for (let i = 0; i < playList.value.length; i++){
                    if (nowPlayingID.value == playList.value[i].snippet.resourceId.videoId){
                        // 最後一位元素處理
                        if (i+1 >= playList.value.length) {
                           nowPlayingID.value = playList.value[0].snippet.resourceId.videoId
                           break 
                        }
                        nowPlayingID.value = playList.value[i+1].snippet.resourceId.videoId
                        break
                    }
                }
            }
        }
    });

    watch(nowPlayingID, (n) => {
        player.loadVideoById(n)
    })
})

onBeforeUnmount(()=>{
    player.destroy()
    player = null
})

const updateYoutubeIframe = async() => {
    const { videoId, listId } = extractYouTubeID(inputValue.value)

    if (!videoId && !listId){
        inputValue.value = ""
        inputPlaceholder.value = "Invalid YouTube URL"
        return
    }

    if (videoId) {
        nowPlayingID.value = videoId
        playList.value = []
    } 
    if (listId) {
        try {
            const data = await $fetch('/api/youtube/playlist', {
                method: 'get',
                query: { playlistId: listId }
            })
            playList.value = data.items
        } catch (error) {
            console.error(error)
            inputValue.value = "Server Error";
            return
        }
    } 
}

const extractYouTubeID = (url) => {
    if (!url.startsWith("https://")) {
        url = "https://"+url
    }

    try{
        const parsed = new URL(url)
        if (parsed.hostname === "youtu.be") {
            return {videoId: parsed.pathname.slice(1)}
        } else if (parsed.hostname.includes("youtube.com")) {
            if (parsed.pathname.startsWith("/watch")) {
                return {
                    videoId: parsed.searchParams.get("v"),
                    listId: parsed.searchParams.get("list")
                }
            } else if (parsed.pathname.startsWith("/embed/")) {
                return {videoId: parsed.pathname.split("/")[2]}
            } else if (parsed.pathname.startsWith("/playlist")) {
                return {listId: parsed.searchParams.get("list")}
            } else {
                return {videoId: null, listId: null}
            }
        } else {
            return {videoId: null, listId: null}
        }
    } catch (e) {
        console.error("Invalid URL", e);
        return {videoId: null, listId: null};
    }
}
</script>

<style scoped>
::-webkit-scrollbar {
	background-color: transparent;
	width: 8px;
	height: 8px;
}

::-webkit-scrollbar-thumb {
	background-color: rgb(63 63 70);
	border-radius: 4px;
}
</style>