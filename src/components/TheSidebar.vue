<template>
  <div class="sidebar">
    <div class="sidebar__inner">
      <router-link class="logo" to="/">
        <img class="logo__img" src="../assets/img/logo.svg" alt="logo" />
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "TheSidebar",
};
</script>

<style lang="scss" scoped>
.sidebar {
  background-color: rgb(17, 24, 39);
  width: 256px;
  height: 100vh;

  &__inner {
    padding: 28px 0;
  }
}
</style>
