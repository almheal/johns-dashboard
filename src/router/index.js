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
    path: "/products",
    name: "Products",
    meta: { layout: "DefaultLayout", auth: true },
    component: () => import("../views/Products"),
  },
  {
    path: "/products/:action",
    name: "Product",
    meta: { layout: "DefaultLayout", auth: true },
    component: () => import("../views/Product"),
  },
  {
    path: "/categories",
    name: "Categories",
    meta: { layout: "DefaultLayout", auth: true },
    component: () => import("../views/Categories"),
  },
  {
    path: "/locales",
    name: "Locales",
    meta: { layout: "DefaultLayout", auth: true },
    component: () => import("../views/Locales"),
  },
  {
    path: "/locale-messages/:id",
    name: "LocaleMessages",
    meta: { layout: "DefaultLayout", auth: true },
    component: () => import("../views/LocaleMessages"),
  },
  {
    path: "/tags",
    name: "Tags",
    meta: { layout: "DefaultLayout", auth: true },
    component: () => import("../views/Tags"),
  },
  {
    path: "/ingredients",
    name: "Ingredients",
    meta: { layout: "DefaultLayout", auth: true },
    component: () => import("../views/Ingredients"),
  },
  {
    path: "/ingredients/:action",
    name: "Ingredient",
    meta: { layout: "DefaultLayout", auth: true },
    component: () => import("../views/Ingredient"),
  },
  {
    path: "/features",
    name: "Features",
    meta: { layout: "DefaultLayout", auth: true },
    component: () => import("../views/Features"),
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
