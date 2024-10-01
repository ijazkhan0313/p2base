import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DashboardView from '@/views/DashboardView.vue'
import SuccessOrderView from '@/views/SuccessOrderView.vue'
import ResetPwdView from '@/views/ResetPwdView.vue'
import Policy from '@/views/Policy.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/confirmation',
      name: 'orderConrimation',
      component: SuccessOrderView,
    },
    {
      path: '/policy',
      name: 'policy',
      component: Policy
    },
    {
      path: '/renouvellement-mdp',
      name: 'reset-pwd',
      component: ResetPwdView
    },
  ]
})

export default router
