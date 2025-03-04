import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import AddJob from '@/pages/AddJob.vue';


const routes = [
  { path: '/', component: Home },
  { path: '/add', component: AddJob },
  { path: '/about', component: () => import('@/pages/About.vue') }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
