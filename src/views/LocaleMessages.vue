<template>
  <div class="locale-messages">
    <h1 class="locale-messages__title">
      {{ `${$t("admin.editor.title")} "${routeLocale.title}"` }}
    </h1>
    <form class="locale-messages__form" @submit.prevent="editLocaleMessages">
      <app-input
        class="locale-messages__input"
        placeholder="admin.utils.edit"
        v-model="localeMessage.property"
      />
      <app-input
        class="locale-messages__input"
        :placeholder="$t('admin.localeMessagesEdit.value')"
        v-model="localeMessage.value"
      />
      <app-button
        class="locale-messages__button"
        buttonType="submit"
        :text="$t('admin.utils.edit')"
        :loading="itemLoader || updateLoader"
      />
    </form>
    <div class="locale-messages__error">
      <span v-if="isError">{{ $t("admin.editor.error") }}</span>
    </div>
    <div class="locale-messages__body">
      <locale-messages-editor v-model="messages" :loading="itemLoader" />
    </div>
  </div>
</template>

<script>
import AppButton from "@/components/elements/AppButton";
import AppInput from "@/components/elements/AppInput";
import LocaleMessagesEditor from "@/components/LocaleMessagesEditor";
import { mapActions, mapState } from "vuex";

export default {
  name: "LocaleMessages",
  components: {
    AppButton,
    AppInput,
    LocaleMessagesEditor,
  },
  data: () => ({
    messages: "{}",
    localeMessage: {
      property: "",
      value: "",
    },
    isError: false,
  }),
  watch: {
    messages(value) {
      this.validate(value);
    },
  },
  computed: {
    ...mapState({
      getAllLocaleMessages: (state) => state.localeMessages.items,
      itemLoader: (state) => state.localeMessages.getItemLoader,
      updateLoader: (state) => state.localeMessages.updateLoader,
      getLocales: (state) => state.locale.items,
      getCurrentLocale: (state) => state.locale.item,
    }),
    getCurrentLocaleMessages() {
      return this.getAllLocaleMessages.find(
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
      getLocaleMessages: "localeMessages/getItem",
      updateLocaleMessages: "localeMessages/updateItem",
    }),
    async editLocaleMessages() {
      this.editViaForm();
      return;
      // if (this.isError) {
      //   return;
      // }

      // await this.updateLocaleMessages({
      //   id: this.getCurrentLocaleMessages._id,
      //   body: { messages: this.messages },
      // });

      // if (
      //   this.getCurrentLocaleMessages._id === this.getCurrentLocale.messages
      // ) {
      //   this.$i18n.setLocaleMessage(
      //     this.getCurrentLocale.title,
      //     JSON.parse(this.getCurrentLocaleMessages.messages)
      //   );
      // }
    },
    editViaForm() {
      if (!this.localeMessage.property || !this.localeMessage.value) {
        return;
      }

      const localeMessagesObject = JSON.parse(this.messages);
      const splitProperties = this.localeMessage.property.split(".");
      const gg = splitProperties.reduce((acc, property) => {
        if (property) {
          acc = acc[property];
        }
        return acc;
      }, localeMessagesObject);
      console.log(gg);
      console.log(localeMessagesObject.admin.utils);
    },
    validate(value) {
      try {
        JSON.parse(value);
        if (this.isError) {
          this.isError = false;
        }
      } catch (err) {
        this.isError = true;
      }

      this.messages = this.formatMessages(this.messages);
    },
    formatMessages(messages) {
      return JSON.stringify(JSON.parse(messages), null, 2);
    },
  },
  async mounted() {
    if (!this.getCurrentLocaleMessages) {
      await this.getLocaleMessages({ id: this.$route.params.id });
    }
    this.messages = this.getCurrentLocaleMessages
      ? this.formatMessages(this.getCurrentLocaleMessages.messages)
      : "{}";
  },
};
</script>

<style lang="scss" scoped>
.locale-messages {
  display: flex;
  flex-direction: column;

  &__title {
    font-size: 21px;
    font-weight: 500;
  }

  &__form {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
  }

  &__input {
    margin-right: 10px;
  }

  &__button {
    margin-top: 12px;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  &__body {
    height: 100%;
  }

  &__error {
    height: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 10px;
    font-size: 16px;
    color: rgb(239, 68, 68);
  }
}
</style>
