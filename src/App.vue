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
import LanguageMixin from "@/mixins/LanguageMixin";
import { getLocalStorage } from "@/utils";
import { USER_TOKEN_NAME, LOCALE_NAME, DEFAULT_LOCALE } from "@/consts";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: "App",
  mixins: [LanguageMixin],
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
      getLocales: "locale/getItems",
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
    ...mapMutations({
      setAppLocale: "locale/setItem",
    }),
    async localeHandler() {
      await this.getAllLocales();
      const locale = getLocalStorage(LOCALE_NAME);
      await this.setLocale(locale ? locale : DEFAULT_LOCALE);
    },
    async authUser() {
      if (getLocalStorage(USER_TOKEN_NAME)) {
        await this.auth();
      }
    },
  },
  async mounted() {
    Promise.all([this.localeHandler(), this.authUser()]).then(() => {
      this.showApp = true;
    });
  },
};
</script>

<style lang="scss">
@import "./assets/styles/index.scss";
</style>
