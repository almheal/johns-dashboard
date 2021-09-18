<script>
import { setLocalStorage } from "@/utils";
import { LOCALE_NAME } from "@/consts";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: "LanguageMixin",
  computed: {
    ...mapGetters({
      getCurrentLocale: "locale/getItem",
      getLocales: "locale/getItems",
      getAllLocaleMessages: "localeMessages/getItems",
    }),
    currentLocaleMessages() {
      return this.getAllLocaleMessages.find(
        (localeMessages) =>
          localeMessages._id === this.getCurrentLocale.messages
      );
    },
  },
  methods: {
    ...mapActions({
      getLocaleMessages: "localeMessages/getItem",
    }),
    ...mapMutations({
      setAppLocale: "locale/setItem",
      setAppMessages: "localeMessages/setItem",
    }),
    async setLocale(localeTitle) {
      let locale = this.getLocales.find(
        (item) => item.title.toLowerCase() === localeTitle
      );

      if (!locale && this.getLocales.length) {
        const [firstLocale] = this.getLocales;
        locale = firstLocale;
      }

      if (!this.getLocales.length) {
        locale = {};
      }

      const title = locale.title ? locale.title.toLowerCase() : "";
      this.setAppLocale(locale);
      setLocalStorage({
        key: LOCALE_NAME,
        data: title,
      });

      await this.setLocaleMessages(locale);
    },
    async setLocaleMessages(locale) {
      if (!locale.title || !locale.messages) {
        return;
      }

      if (!this.currentLocaleMessages) {
        await this.getLocaleMessages(locale.messages);
      }

      this.$i18n.locale = this.getCurrentLocale.title;

      this.$i18n.setLocaleMessage(
        this.getCurrentLocale.title,
        this.currentLocaleMessages
          ? JSON.parse(this.currentLocaleMessages.messages)
          : {}
      );
    },
  },
};
</script>
