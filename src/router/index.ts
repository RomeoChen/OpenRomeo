import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Article from '../views/Article.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/article/:slug', name: 'article', component: Article },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
