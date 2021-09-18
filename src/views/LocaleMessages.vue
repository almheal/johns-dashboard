<template>
  <div class="locale-messages">
    <div class="locale-messages__header">
      <h1 class="locale-messages__title">
        {{ `${$t("admin.editor.title")} "${routeLocale.title}"` }}
      </h1>
      <app-button
        text="admin.utils.edit"
        :loading="getLoader"
        @clickButton="editLocaleMessages"
      />
    </div>
    <div class="locale-messages__error">
      <span v-if="isError">{{ $t("admin.editor.error") }}</span>
    </div>
    <div class="locale-messages__body">
      <locale-messages-editor v-model="messages" />
    </div>
  </div>
</template>

<script>
import AppButton from "@/components/elements/AppButton";
import LocaleMessagesEditor from "@/components/LocaleMessagesEditor";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "LocaleMessages",
  components: {
    AppButton,
    LocaleMessagesEditor,
  },
  data: () => ({
    messages: "{}",
    isError: false,
  }),
  watch: {
    messages(value) {
      try {
        JSON.parse(value);
        if (this.isError) {
          this.isError = false;
        }
      } catch (err) {
        this.isError = true;
      }
    },
  },
  computed: {
    ...mapGetters({
      getLocaleMessages: "localeMessages/getItems",
      getLoader: "localeMessages/getLoader",
      getLocales: "locale/getItems",
      getCurrentLocale: "locale/getItem",
    }),
    getCurrentLocaleMessages() {
      return this.getLocaleMessages.find(
        (localeMessages) => localeMessages._id === this.$route.params.id
      );
    },
    routeLocale() {
      return this.getLocales.find(
        (locale) => locale.messages === this.$route.params.id
      );
    },
  },
  methods: {
    ...mapActions({
      updateLocaleMessages: "localeMessages/updateItem",
    }),
    async editLocaleMessages() {
      if (this.isError) {
        return;
      }

      await this.updateLocaleMessages({
        id: this.getCurrentLocaleMessages._id,
        body: { messages: this.messages },
      });

      if (
        this.getCurrentLocaleMessages._id === this.getCurrentLocale.messages
      ) {
        this.$i18n.setLocaleMessage(
          this.getCurrentLocale.title,
          JSON.parse(this.getCurrentLocaleMessages.messages)
        );
      }
    },
  },
  mounted() {
    this.messages = this.getCurrentLocaleMessages
      ? JSON.stringify(
          JSON.parse(this.getCurrentLocaleMessages.messages),
          null,
          2
        )
      : "{}";
  },
};
</script>

<style lang="scss" scoped>
.locale-messages {
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  &__title {
    font-size: 21px;
    font-weight: 500;
  }

  &__body {
    height: 100%;
  }

  &__error {
    height: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 25px;
    font-size: 16px;
    color: rgb(239, 68, 68);
  }
}
</style>
