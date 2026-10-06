<script setup lang="ts">
import { BookOutlined, CalendarOutlined, FireOutlined, GlobalOutlined } from '@ant-design/icons-vue'

const navItems = [
  { name: 'home', label: 'Plan', icon: FireOutlined },
  { name: 'review', label: 'Daily review', icon: CalendarOutlined },
  { name: 'mistakes', label: 'Mistakes', icon: BookOutlined },
  { name: 'youpass', label: 'YouPass', icon: GlobalOutlined },
]
</script>

<template>
  <a-config-provider
    :theme="{ token: { colorPrimary: '#4f46e5', borderRadius: 10, fontSize: 15 } }"
  >
    <div class="min-h-dvh bg-slate-50 text-slate-800">
      <header class="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
        <div class="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
          <RouterLink to="/" class="flex h-11 items-center gap-2 font-semibold text-slate-900">
            <span
              class="grid size-8 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white"
            >
              ER
            </span>
            English Review
          </RouterLink>

          <nav class="hidden items-center gap-1 md:flex">
            <RouterLink
              v-for="item in navItems"
              :key="item.name"
              v-slot="{ href, navigate, isActive }"
              :to="{ name: item.name }"
              custom
            >
              <a
                :href="href"
                :class="[
                  'flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                ]"
                @click="navigate"
              >
                <component :is="item.icon" />
                {{ item.label }}
              </a>
            </RouterLink>
          </nav>
        </div>
      </header>

      <main class="mx-auto max-w-5xl pt-4 pb-28 md:pt-6 md:pb-12">
        <RouterView />
      </main>

      <!-- Mobile bottom tab bar -->
      <nav
        class="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      >
        <div class="grid grid-cols-4">
          <RouterLink
            v-for="item in navItems"
            :key="item.name"
            v-slot="{ href, navigate, isActive }"
            :to="{ name: item.name }"
            custom
          >
            <a
              :href="href"
              :class="[
                'flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium',
                isActive ? 'text-indigo-600' : 'text-slate-500',
              ]"
              @click="navigate"
            >
              <component :is="item.icon" class="text-xl" />
              {{ item.label }}
            </a>
          </RouterLink>
        </div>
      </nav>
    </div>
  </a-config-provider>
</template>
