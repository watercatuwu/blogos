<template>
    <div class="fixed bottom-0 right-0 m-4 mb-20 z-50">
        <transition-group
            name="toast"
            tag="div"
        >
            <div
                v-for="(toast, index) in toasts"
                :key="index"
                :class="[borderColor[toast.type]]"
                class="flex max-w-72 gap-2 bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg border-2 mb-2 toast-item"
            >
                <p class="break-all">{{ toast.msg }}</p>
                <button @click="removeToast(index)" class="text-red-400">Dismiss</button>
            </div>
        </transition-group>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const toasts = ref([])
const { $on } = useNuxtApp().$bus

const borderColor = {
    'success': 'border-green-500',
    'error': 'border-red-500',
    'warn': 'border-yellow-500',
}

$on('addToast', (obj) => {
    addToast(obj.type, obj.msg)
})

const addToast = (type, msg) => {
    toasts.value.push({ type, msg })
    setTimeout(() => {
        removeToast(toasts.value.length - 1) // remove last toast
    }, 3000)
}

const removeToast = (index) => {
    toasts.value.splice(index, 1)
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.4s, transform 0.4s;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>