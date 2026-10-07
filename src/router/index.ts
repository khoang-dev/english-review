import { createRouter, createWebHistory } from 'vue-router'
import TabView from '@/views/TabView.vue'
import { reviewRoute, tabRoute } from './tabs'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Every page is a `?tab=` of the root (src/router/tabs.ts)
    { path: '/', name: 'app', component: TabView },
    // Old path URLs keep working
    {
      path: '/review/:date(\\d{4}-\\d{2}-\\d{2})?',
      redirect: (to) =>
        reviewRoute(typeof to.params.date === 'string' ? to.params.date : undefined),
    },
    { path: '/mistakes', redirect: () => tabRoute('mistakes') },
    { path: '/youpass', redirect: () => tabRoute('youpass') },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // Swiping days only changes the date query — keep the scroll position then
    if (to.query.tab === 'review' && from.query.tab === 'review') return false
    return savedPosition ?? { top: 0 }
  },
})

export default router
