import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Article from '../views/Article.vue'
import Quiz from '../views/Quiz.vue'
import DiseaseNetwork from '../views/DiseaseNetwork.vue'
import Recommendation from '../views/Recommendation.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/article/:slug', name: 'article', component: Article },
  { path: '/quiz', name: 'quiz', component: Quiz },
  { path: '/disease-network', name: 'disease-network', component: DiseaseNetwork },
  { path: '/recommendation', name: 'recommendation', component: Recommendation },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
