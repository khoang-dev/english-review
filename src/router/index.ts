import { createRouter, createWebHistory } from 'vue-router'
import ReviewView from '@/views/ReviewView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: { name: 'review' } },
    {
      // Daily review carousel; without a date it opens on today
      path: '/review/:date(\\d{4}-\\d{2}-\\d{2})?',
      name: 'review',
      component: ReviewView,
    },
    {
      path: '/mistakes',
      name: 'mistakes',
      component: () => import('@/views/MistakesView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // Swiping days only changes the date param — keep the scroll position then
    if (to.name === from.name && to.name === 'review') return false
    return savedPosition ?? { top: 0 }
  },
})

export default router
