import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useLogbookStore } from '@/stores/logbook'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/Map',
      name: 'map',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/MapView.vue')
    },
    {
      path: '/Logbook',
      name: 'logbook',
      component: () => import('@/views/Logbook.vue')
    },
    {
      path: '/Logbook/:id',
      name: 'flight',
      component: () => import('@/views/FlightDetails.vue')
    }
  ]
})

// Add navigation guard to clear filters
router.beforeEach((to, from, next) => {
  // Only clear filters when actually changing views (not just params)
  if (from.name && to.name && from.name !== to.name) {
    const store = useLogbookStore();
    store.clearFilters();
  }
  next();
})

export default router
