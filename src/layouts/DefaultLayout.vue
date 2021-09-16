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

  &__body {
    flex: 1 1 0;
    padding: 24px 32px;
  }
}
</style>
