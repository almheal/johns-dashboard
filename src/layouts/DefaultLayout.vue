<template>
  <div class="layout">
    <the-sidebar />
    <router-view />
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
}
</style>
