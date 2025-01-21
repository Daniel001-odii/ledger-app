import { createRouter, createWebHistory } from 'vue-router'
import CustomerRecord from '@/views/CustomerRecord.vue'
import DashboardView from '@/views/DashboardView.vue'

import LedgerGroup from '@/views/LedgerGroup.vue'

import NewApp from '@/views/NewApp.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
  },
  {
    path: '/customers/:customer_id',
    name: 'home',
    component: CustomerRecord
  },
  {
    path: '/group/:group',
    name: 'Ledger Group',
    component: LedgerGroup,
  },
  {
    path: '/app',
    name: 'New App',
    component: NewApp,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
