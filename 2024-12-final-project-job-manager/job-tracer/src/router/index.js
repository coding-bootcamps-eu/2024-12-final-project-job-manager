import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import AddJobPage from "@/pages/AddJobPage.vue";
import About from "@/pages/About.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/add", component: AddJobPage },
  { path: "/about", component: About },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
