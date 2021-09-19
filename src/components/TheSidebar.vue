<template>
  <div class="sidebar">
    <div class="sidebar__inner">
      <div class="sidebar__body">
        <router-link class="logo" to="/">
          <img class="logo__img" src="../assets/img/logo.svg" alt="logo" />
          <h4 class="logo__title">Dashboard</h4>
        </router-link>
        <navigation-menu :menu="menu" />
        <dropdown-language class="sidebar__language" />
      </div>
      <button class="logout" @click="logout">{{ $t("admin.logout") }}</button>
    </div>
  </div>
</template>

<script>
import NavigationMenu from "@/components/NavigationMenu";
import DropdownLanguage from "@/components/language/DropdownLanguage";
import { setLocalStorage } from "@/utils";
import { USER_TOKEN_NAME } from "@/consts";

export default {
  name: "TheSidebar",
  components: {
    NavigationMenu,
    DropdownLanguage,
  },
  data: () => ({
    menu: [
      {
        name: "admin.menu.main",
        icon: "AppDashboardIcon",
        link: "/",
      },
      {
        name: "app.tags.title",
        icon: "AppTagIcon",
        link: "/tags",
      },
      {
        name: "admin.menu.locales",
        link: "/locales",
        icon: "AppTranslationIcon",
      },
    ],
  }),
  methods: {
    logout() {
      setLocalStorage({ key: USER_TOKEN_NAME, data: "" });
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  position: sticky;
  left: 0;
  top: 0;
  background-color: rgb(17, 24, 39);
  width: 256px;
  height: 100vh;

  &__inner {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 28px 0;
    height: 100%;
  }

  &__language {
    margin: 16px 24px 0;
  }
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  margin-bottom: 35px;

  &__img {
    width: 29px;
    height: 34px;
  }

  &__title {
    font-size: 24px;
    font-weight: 600;
    color: #fff;
    margin-left: 15px;
  }
}

.logout {
  padding: 10px 24px;
  background-color: transparent;
  color: #6b7280;
  font-size: 16px;
  transition: color 0.3s;

  &:hover {
    color: #fff;
  }
}
</style>
