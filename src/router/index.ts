import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Article from '../views/Article.vue'
import ArticleHub from '../views/ArticleHub.vue'
import Quiz from '../views/Quiz.vue'
import DiseaseNetwork from '../views/DiseaseNetwork.vue'
import Recommendation from '../views/Recommendation.vue'
import Disease3D from '../views/Disease3D.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/articles', name: 'articles', component: ArticleHub },
  { path: '/article/:slug', name: 'article', component: Article },
  { path: '/quiz', name: 'quiz', component: Quiz },
  { path: '/disease-network', name: 'disease-network', component: DiseaseNetwork },
  { path: '/recommendation', name: 'recommendation', component: Recommendation },
  { path: '/disease-3d', name: 'disease-3d', component: Disease3D },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
