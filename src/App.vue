<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const selectedKeys = computed(() => [route.name])
</script>

<template>
  <a-config-provider :theme="{ token: { colorPrimary: '#1677ff' } }">
    <a-layout class="min-h-screen">
      <a-layout-header class="flex items-center gap-6">
        <RouterLink to="/" class="text-lg font-semibold text-white!">English Review</RouterLink>
        <a-menu theme="dark" mode="horizontal" :selected-keys="selectedKeys" class="flex-1 min-w-0">
          <a-menu-item key="home">
            <RouterLink to="/">Home</RouterLink>
          </a-menu-item>
          <a-menu-item key="about">
            <RouterLink to="/about">About</RouterLink>
          </a-menu-item>
        </a-menu>
      </a-layout-header>
      <a-layout-content class="p-6">
        <RouterView />
      </a-layout-content>
    </a-layout>
  </a-config-provider>
</template>
