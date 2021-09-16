<template>
  <div class="layout">
    <div class="layout__background">
      <div class="layout__skew"></div>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "EmptyLayout",
};
</script>

<style lang="scss" scoped>
.layout {
  position: relative;
  height: 100vh;
  background-color: #172b4d;

  &__background {
    position: absolute;
    left: 0;
    top: 0;
    height: calc(50% + 60px);
    width: 100%;
    background-image: linear-gradient(87deg, #5e72e4 0, #825ee4 100%);
  }

  &__skew {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-bottom: 60px solid #172b4d;
    border-left: 100vw solid transparent;
  }
}
</style>
