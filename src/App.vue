<template>
  <component :is="layout">
    <router-view />
  </component>
  <the-notification
    :notifications="getNotifications"
    @closeNotification="removeNotification"
  />
</template>

<script>
import EmptyLayout from "@/layouts/EmptyLayout";
import TheNotification from "@/components/TheNotification";
import { getLocalStorage } from "@/utils";
import { USER_TOKEN_NAME } from "@/consts";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    EmptyLayout,
    TheNotification,
  },
  computed: {
    ...mapGetters({
      getNotifications: "notification/getNotifications",
    }),
    layout() {
      return this.$route.meta.layout;
    },
  },
  methods: {
    ...mapActions({
      removeNotification: "notification/removeNotification",
      auth: "user/auth",
    }),
  },
  mounted() {
    if (getLocalStorage(USER_TOKEN_NAME)) {
      this.auth();
      console.log("gg");
    }
  },
};
</script>

<style lang="scss">
@import "./assets/styles/index.scss";
</style>
