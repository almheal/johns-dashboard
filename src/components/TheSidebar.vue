<template>
  <div class="sidebar">
    <div class="sidebar__inner">
      <router-link class="logo" to="/">
        <img class="logo__img" src="../assets/img/logo.svg" alt="logo" />
        <h4 class="logo__title">Dashboard</h4>
      </router-link>
      <navigation-menu :menu="menu" />
      <dropdown-language class="sidebar__language" />
    </div>
  </div>
</template>

<script>
import NavigationMenu from "@/components/NavigationMenu";
import DropdownLanguage from "@/components/language/DropdownLanguage";

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
        name: "admin.menu.locales",
        link: "/locales",
        icon: "AppTranslationIcon",
      },
    ],
  }),
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
</style>
