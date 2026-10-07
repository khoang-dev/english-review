<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import type { Component } from 'vue'
import { useTab } from '@/router/tabs'
import type { Tab } from '@/router/tabs'
import HomeView from './HomeView.vue'
import ReviewView from './ReviewView.vue'
import NotFoundView from './NotFoundView.vue'

// The page for the `?tab=` query (see src/router/tabs.ts)
const views: Record<Tab, Component> = {
  home: HomeView,
  review: ReviewView,
  mistakes: defineAsyncComponent(() => import('./MistakesView.vue')),
  youpass: defineAsyncComponent(() => import('./YouPassView.vue')),
}

const tab = useTab()
</script>

<template>
  <component :is="tab ? views[tab] : NotFoundView" />
</template>
