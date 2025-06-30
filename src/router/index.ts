import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/create',
      name: 'CreatePot',
      component: () => import('../views/CreatePotView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pot/:shareCode',
      name: 'PotView',
      component: () => import('../views/PotView.vue'),
      props: true,
    },
    {
      path: '/auth',
      name: 'Auth',
      component: () => import('../views/AuthView.vue'),
    },
  ],
})

router.beforeEach(async (to, _, next) => {
  const { isAuthenticated } = useAuth()
  
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/auth')
  } else {
    next()
  }
})

export default router