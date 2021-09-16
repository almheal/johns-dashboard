<template>
  <component :is="layout" v-if="showApp">
    <router-view />
  </component>
  <the-notification
    :notifications="getNotifications"
    @closeNotification="removeNotification"
  />
</template>

<script>
import EmptyLayout from "@/layouts/EmptyLayout";
import DefaultLayout from "@/layouts/DefaultLayout";
import TheNotification from "@/components/TheNotification";
import { getLocalStorage } from "@/utils";
import { USER_TOKEN_NAME } from "@/consts";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    EmptyLayout,
    DefaultLayout,
    TheNotification,
  },
  data: () => ({
    showApp: false,
  }),
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
      getAllLocales: "locale/getAllItems",
    }),
  },
  async mounted() {
    await this.getAllLocales();
    if (getLocalStorage(USER_TOKEN_NAME)) {
      await this.auth();
    }

    this.showApp = true;
  },
};
</script>

<style lang="scss">
@import "./assets/styles/index.scss";
</style>
