import { createRouter, createWebHistory } from "vue-router";
import { getLocalStorage } from "@/utils";
import { USER_TOKEN_NAME } from "@/consts";

const routes = [
  {
    path: "/",
    name: "Home",
    meta: { layout: "DefaultLayout", auth: true },
    component: () => import("../views/Home"),
  },
  {
    path: "/login",
    name: "Login",
    meta: { layout: "EmptyLayout", auth: false },
    component: () => import("../views/Login"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuth = to.meta.auth;
  const token = getLocalStorage(USER_TOKEN_NAME);

  if (isAuth) {
    if (!token) {
      next({
        name: "Login",
      });
    } else {
      next();
    }
  } else if (to.path === "/login" && token) {
    const nextRouteName = from.name ? from.name : "Home";
    next({
      name: nextRouteName,
    });
  } else {
    next();
  }
});

export default router;
