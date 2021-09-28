<template>
  <div class="layout">
    <the-sidebar />
    <router-view class="layout__body" />
  </div>
</template>

<script>
import TheSidebar from "@/components/TheSidebar";

export default {
  name: "DefaultLayout",
  components: {
    TheSidebar,
  },
};
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background-color: rgb(229, 231, 235);

  &__body {
    flex: 1 1 0;
    padding: 32px 40px;
  }
}
</style>
