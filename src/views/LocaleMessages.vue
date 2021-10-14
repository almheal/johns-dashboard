<template>
  <div class="locale-messages">
    <h1 class="locale-messages__title">
      {{ `${$t("admin.editor.title")} "${routeLocale.title}"` }}
    </h1>

    <form class="locale-messages__form" @submit.prevent="editLocaleMessages">
      <app-input
        class="locale-messages__input"
        placeholder="example.nesting.user.title"
        :isError="pathError"
        v-model="nestingPath"
        @update:modelValue="error = ''"
      />
      <div class="locale-messages__icon" />
      <app-input
        class="locale-messages__input"
        placeholder="Dmitry"
        :isError="valueError"
        v-model="value"
        @update:modelValue="error = ''"
      />
      <app-button
        class="locale-messages__button"
        :text="$t('admin.utils.edit')"
        :loading="itemLoader || updateLoader"
        buttonType="submit"
      />
    </form>
    <div class="locale-messages__error">
      <span v-if="error">{{ $t(error) }}</span>
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
    error: "",
    nestingPath: "",
    value: "",
    valueError: false,
    pathError: false,
  }),
  watch: {
    messages(value) {
      try {
        JSON.parse(value);
        if (this.error) {
          this.error = "";
        }
      } catch (err) {
        this.error = "admin.editor.error";
      }
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
      if (this.error) {
        return;
      }

      let messages;

      if (this.nestingPath || this.value) {
        const isValid = this.validateForm();
        if (!isValid) {
          return;
        }

        const split = this.nestingPath.split(".").filter((key) => key);
        const property = split.splice(-1, 1);
        const messagesObject = JSON.parse(this.messages);
        let lastObject = messagesObject;

        split.forEach((key) => {
          if (!lastObject[key] && typeof lastObject !== "string") {
            const emptyObject = {};
            lastObject[key] = emptyObject;
            lastObject = emptyObject;
          } else if (typeof lastObject !== "string") {
            lastObject = lastObject[key];
          }
        });

        if (typeof lastObject !== "object") {
          this.error = "admin.editor.stringError";
          return;
        }

        lastObject[property] = this.value;
        messages = JSON.stringify(messagesObject);
      } else {
        messages = this.messages;
      }

      await this.updateLocaleMessages({
        id: this.getCurrentLocaleMessages._id,
        body: { messages: messages },
      });

      if (
        this.getCurrentLocaleMessages._id === this.getCurrentLocale.messages
      ) {
        this.$i18n.setLocaleMessage(
          this.getCurrentLocale.title,
          JSON.parse(this.getCurrentLocaleMessages.messages)
        );
      }

      this.messages = this.formatMessages(messages);
    },
    validateForm() {
      if (this.nestingPath && !this.value) {
        this.valueError = true;
        return false;
      }

      if (!this.nestingPath && this.value) {
        this.pathError = true;
        return false;
      }

      return true;
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

  &__form {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  &__body {
    position: relative;
    height: 100%;
  }

  &__error {
    height: 32px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 0 0 18px auto;
    max-width: 400px;
    font-size: 16px;
    color: rgb(239, 68, 68);
  }

  &__icon {
    position: relative;
    margin: 0 15px;
    height: 10px;
    width: 18px;

    &::before,
    &::after {
      content: "";
      width: 100%;
      height: 2px;
      background-color: #4f46e5;
      position: absolute;
      left: 0;
      top: 0;
    }

    &::after {
      top: initial;
      bottom: 0;
    }
  }

  &__button {
    margin-left: 15px;
  }
}
</style>
