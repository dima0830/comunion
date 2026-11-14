import { createRouter, createWebHistory } from "vue-router";
import IndexView from "../views/index.vue";

const routes = [
  { path: "/", name: "home", component: IndexView },
  // cualquier otra dirección (por ejemplo, un enlace viejo) lleva a la invitación
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
