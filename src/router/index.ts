import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ListDetail from '../views/ListDetail.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/ListDetail/:id',
    name: 'ListDetail',
    component: ListDetail
  },
  {
    path: '/addList',
    name: 'addList',
    component: () => import('../views/AddList.vue')
  },
  {
    path: '/CalenderView',
    name: 'CalenderView',
    component: () => import('../views/CalenderView.vue')
  },
  {
    path: '/ChartsView',
    name: 'ChartsView',
    component: () => import('../views/ChartsView.vue')
  },
  {
    path: '/CardManagement',
    name: 'CardManagement',
    component: () => import('../views/CardManagement.vue')
  },
  {
    path: '/ChartsDetail',
    name: 'ChartsDetail',
    component: () => import('../views/ChartsDetail.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router
