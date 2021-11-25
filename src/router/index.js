import { createRouter, createWebHistory } from "vue-router";
import { getLocalStorage } from "@/utils";
import { USER_TOKEN_NAME, ROLES_NAME, ROLES } from "@/consts";
import store from "@/store";

const routes = [
  {
    path: "/",
    name: "Home",
    meta: {
      layout: "DefaultLayout",
      auth: true,
      roles: [ROLES.ADMIN, ROLES.EMPLOYEE, ROLES.DEVELOPER],
    },
    component: () => import("../views/Home"),
  },
  {
    path: "/products",
    name: "Products",
    meta: {
      layout: "DefaultLayout",
      auth: true,
      roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
    },
    component: () => import("../views/Products"),
  },
  {
    path: "/products/:action",
    name: "Product",
    meta: {
      layout: "DefaultLayout",
      auth: true,
      roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
    },
    component: () => import("../views/Product"),
  },
  {
    path: "/categories",
    name: "Categories",
    meta: {
      layout: "DefaultLayout",
      auth: true,
      roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
    },
    component: () => import("../views/Categories"),
  },
  {
    path: "/locales",
    name: "Locales",
    meta: {
      layout: "DefaultLayout",
      auth: true,
      roles: [ROLES.ADMIN, ROLES.EMPLOYEE, ROLES.DEVELOPER],
    },
    component: () => import("../views/Locales"),
  },
  {
    path: "/locale-messages/:id",
    name: "LocaleMessages",
    meta: {
      layout: "DefaultLayout",
      auth: true,
      roles: [ROLES.ADMIN, ROLES.EMPLOYEE, ROLES.DEVELOPER],
    },
    component: () => import("../views/LocaleMessages"),
  },
  {
    path: "/tags",
    name: "Tags",
    meta: {
      layout: "DefaultLayout",
      auth: true,
      roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
    },
    component: () => import("../views/Tags"),
  },
  {
    path: "/ingredients",
    name: "Ingredients",
    meta: {
      layout: "DefaultLayout",
      auth: true,
      roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
    },
    component: () => import("../views/Ingredients"),
  },
  {
    path: "/ingredients/:action",
    name: "Ingredient",
    meta: {
      layout: "DefaultLayout",
      auth: true,
      roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
    },
    component: () => import("../views/Ingredient"),
  },
  {
    path: "/features",
    name: "Features",
    meta: {
      layout: "DefaultLayout",
      auth: true,
      roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
    },
    component: () => import("../views/Features"),
  },
  {
    path: "/promo-codes",
    name: "PromoCodes",
    meta: {
      layout: "DefaultLayout",
      auth: true,
      roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
    },
    component: () => import("../views/PromoCodes"),
  },
  {
    path: "/promo-code/:action",
    name: "PromoCode",
    meta: {
      layout: "DefaultLayout",
      auth: true,
      roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
    },
    component: () => import("../views/PromoCode"),
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

router.beforeEach(async (to, from, next) => {
  const isAuth = to.meta.auth;
  const token = getLocalStorage(USER_TOKEN_NAME);
  let rolesIsNext = true;

  if (to.meta.roles) {
    const user = store.getters["user/getUser"];
    const userRoles = user.roles
      ? user.roles
      : getLocalStorage(ROLES_NAME) || [];
    rolesIsNext = to.meta.roles.find((role) => userRoles.includes(role));
  }

  if (isAuth) {
    if (!token) {
      next({
        name: "Login",
        query: to.query.testUser ? { testUser: true, to: to.path } : {},
      });
    } else if (!rolesIsNext && token) {
      next({ name: "Home" });
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
