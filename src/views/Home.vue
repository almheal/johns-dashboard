<template>
  <div class="home">
    <h1 class="home__title">{{ $t("admin.login.welcome") }}</h1>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__title {
    font-size: 36px;
  }
}
</style>
