<template>
<div class="grid-stack" ref="gridRef" style="height: 100%; width: 100%;">
  <div class="grid-stack-item" v-for="item in items" :gs-w=item.w :gs-h=item.h :gs-x=item.x :gs-y=item.y :data-gs-id=item.id>
    <div class="grid-stack-item-content">
      <div class="flex flex-col w-full h-full bg-zinc-200 dark:bg-zinc-800 opacity-95 rounded-lg">
        <div class="flex justify-between items-center px-4 pt-4 pb-2 rounded-t-lg cursor-move drag-handle">
            <span class="text-sm text-zinc-600 dark:text-zinc-400">{{ item.path || item.id }}</span>
            <div class="flex items-center gap-2">
              <a v-if="item.href" :href=item.href target="_blank" class="inline-flex items-center gap-1 rounded-full py-1 px-2 text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600 transition-colors cursor-pointer">
                <Icon name="material-symbols:open-in-new" />
                open in tab
              </a>
              <button class="w-3 h-3 bg-red-400 rounded-full" @click="removewidget(item.id)"></button>
            </div>
        </div>
        <div class="flex-grow overflow-auto px-4 pt-2 pb-4 rounded-b-lg">
          <component :is=item.component :path=item.path />
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { onMounted, ref, markRaw } from 'vue'
import { GridStack } from 'gridstack'
import ContentRender from './contentRender.vue'
import Youtube from './youtube.vue'
import WeatherWidget from './weatherWidget.vue'
import Posts from './posts.vue'
import 'gridstack/dist/gridstack.min.css'

let idCounter = 0

const widgets = {
  about: {
    path: '/about',
    component: markRaw(ContentRender),
    href: '/about'
  },
  posts: {
    path: '/posts',
    component: markRaw(Posts),
    href: '/posts'
  }
}
 
const { $emit, $on } = useNuxtApp().$bus
$on('addWidget', (payload) => {
  const id = idCounter++
  addwidget(
    `widget-${id}`,
    widgets[payload].component, 
    widgets[payload].path || "",
    widgets[payload].href || null,
    0,0,4,4
  )
})
$on('addPostWidget', (payload) => {
  const id = idCounter++
  addwidget(
    `widget-${id}`,
    markRaw(ContentRender), 
    payload,
    payload,
    0,0,4,4
  )
})


/*
const items = ref([
  { id: 'yt', x:9, y:4, w:3, h:4, component: markRaw(Youtube) },
  { id: 'weather', x:6, y:4, w: 3, h: 4, component: markRaw(WeatherWidget) }
])*/

const gridRef = ref(null)
let grid = null
const items = ref([
  { id: 'yt', x:9, y:4, w:3, h:4, component: markRaw(Youtube) },
  { id: 'weather', x:6, y:4, w: 3, h: 4, component: markRaw(WeatherWidget) }
])

const column = 12 // 最大列數
const maxRow = 8 // 最大行數

onMounted(() => {
  const parentHeight = gridRef.value.parentElement.clientHeight // 父層div高度
  grid = GridStack.init({ 
    column: column,
    float: true, 
    cellHeight: `${parentHeight / maxRow}px`,
    maxRow: maxRow,
    margin: 4,
    handle: '.drag-handle'
  }, gridRef.value)
})

const addwidget = (id, component, path, href, x, y, w, h) => {

  // 檢查位置
  const pos = findEmptyPosition(x??0,y??0,w,h)

  // 位置不足處理
  if (!pos.found) {
    console.warn(`No empty position found for widget with id: ${id}`)
    $emit("addToast", {type: "warn", msg: `No empty position found for widget with id: ${id}`})
    return
  }

  // 新增widget到items array
  items.value.push({
    id,
    component: markRaw(component),
    path: path ?? '',
    x: pos.x,
    y: pos.y,
    w: pos.w,
    h: pos.h,
    href: href ?? null
  })

  // 將el註冊成widget
  // 使用 nextTick 確保 DOM 更新後再進行操作
  nextTick(() => {
    const el = document.querySelector(`[data-gs-id="${id}"]`)
    if (el) grid.makeWidget(el)
  })

  // toaster
  $emit("addToast", {type: "success", msg: "Added widget successfully"})
}

const removewidget = (id) => {
  const item = document.querySelector(`[data-gs-id="${id}"]`)
  if (item) {
    grid.removeWidget(item)
  }
  console.log(`Removed widget with id: ${id}`)
}

const findEmptyPosition = (x,y,w,h) => {
  const node = grid.engine.nodes
  const isEmpty = grid.engine.isAreaEmpty(x, y, w, h)
  if (!isEmpty) {
    for (let i = 0; i < column; i++) {
      for (let j = 0; j < maxRow; j++) {
        if (grid.engine.isAreaEmpty(i, j, w, h)) {
          x = i
          y = j
          if (h > maxRow - j) {
            h = maxRow - j
          }
          if (w > column - i) {
            w = column - i
          }
          console.log(`Found empty position at (${x}, ${y})`)
          return { x, y, w, h, found: true }
        }
      }
    }
    return { x, y, w, h, found: false }
  } else {
    return { x, y, w, h, found: true }
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