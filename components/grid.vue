<template>
<div class="grid-stack" ref="gridRef" style="height: 100%; width: 100%;">
  <div class="grid-stack-item" v-for="item in items" :gs-w=item.w :gs-h=item.h :gs-x=item.x :gs-y=item.y :data-gs-id=item.id>
    <div class="grid-stack-item-content">
      <div class="flex flex-col w-full h-full bg-zinc-200 dark:bg-zinc-800 opacity-95 rounded-lg">
        <div class="flex justify-between items-center px-4 py-2 rounded-t-lg cursor-move drag-handle">
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
          <component v-if="item.path" :is=item.component :path=item.path />
          <component v-else :is=item.component />
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
import Timer from './timer.vue'
import Windyframe from './windyframe.vue'

import 'gridstack/dist/gridstack.min.css'

let idCounter = 0

const widgets = {
  about: {
    path: '/about',
    component: markRaw(ContentRender),
    href: '/about',
    pos: { x: 0, y: 0, w: 4, h: 10 }
  },
  posts: {
    path: '/posts',
    component: markRaw(Posts),
    href: '/posts',
    pos: { x: 0, y: 0, w: 4, h: 10 }
  },
  youtube: {
    component: markRaw(Youtube),
    pos: { x: 0, y: 0, w: 4, h: 10 }
  },
  weather: {
    component: markRaw(WeatherWidget),
    pos: { x: 0, y: 0, w: 5, h: 5 }
  },
  timer: {
    component: markRaw(Timer),
    pos: { x: 0, y: 0, w: 3, h: 4 }
  },
  windy: {
    component: markRaw(Windyframe),
    pos: { x: 0, y: 0, w: 4, h: 5 }
  }
}
 
const { $emit, $on } = useNuxtApp().$bus
$on('addWidget', (payload) => {
  if (!payload || !payload.id) {
    console.warn('Invalid payload for addWidget event:', payload)
    return
  }
  let component = null
  let path = null
  let href = null
  let pos = null

  if (payload.isPost) {
    component = markRaw(ContentRender),
    path = payload.id,
    href = payload.id,
    pos = { x: 0, y: 0, w: 4, h: 8 }
  } else if (Object.prototype.hasOwnProperty.call(widgets, payload.id)) {
    component = widgets[payload.id].component
    path = widgets[payload.id].path || null
    href = widgets[payload.id].href || null
    pos = widgets[payload.id].pos || { x: 0, y: 0, w: 4, h: 8 }
  } else {
    console.warn(`Widget with id ${payload.id} not found in widgets object`)
    return
  }

  const id = idCounter++
  addwidget(
    `widget-${id}`,
    component,
    path,
    href,
    pos
  )
})

const gridRef = ref(null)
let grid = null
/*const items = ref([
  { id: 'about', x:0, y:0, w:6, h:10, path: '/about', component: markRaw(ContentRender), href: '/about', },
  { id: 'yt', x:6, y:0, w:3, h:4, component: markRaw(Youtube) },
  { id: 'weather', x:9, y:0, w: 3, h: 4, component: markRaw(WeatherWidget) },
  { id: 'posts', x:6, y:6, w:6, h:6, path: '/posts', component: markRaw(Posts), href: '/posts', }
])*/

const items = ref([])

const column = 12 // 最大列數
const maxRow = 10 // 最大行數

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

const addwidget = (id, component, path, href, pos) => {
  // 檢查位置
  const { x, y, w, h } = pos
  const FixPos = findEmptyPosition(x, y, w, h)

  // 位置不足處理
  if (!FixPos.found) {
    console.warn(`No empty position found for widget with id: ${id}`)
    //$emit("addToast", {type: "warn", msg: `No empty position found for widget with id: ${id}`})
    return
  }

  // 新增widget到items array
  items.value.push({
    id,
    component: markRaw(component),
    path: path ?? null,
    href: href ?? null,
    x: FixPos.x,
    y: FixPos.y,
    w: FixPos.w,
    h: FixPos.h,
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