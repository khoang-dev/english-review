import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/lessons',
      name: 'lessons',
      component: () => import('@/views/LessonsView.vue'),
    },
    {
      path: '/lessons/:id',
      name: 'lesson',
      component: () => import('@/views/LessonDetailView.vue'),
      props: true,
    },
    {
      path: '/about',
      name: 'about',
      // Route-level code splitting: lazy-loaded when the route is visited
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router
