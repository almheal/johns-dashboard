<template>
  <div class="login">
    <div class="container">
      <div class="login__inner">
        <h1 class="login__title">{{ $t("admin.login.welcome") }}</h1>
        <form class="login-form" @submit.prevent="loginHandler">
          <h3 class="login-form__title">{{ $t("admin.login.title") }}</h3>
          <div class="login-form__body">
            <app-input
              :label="$t('admin.login.username')"
              :error="$t(errors.name)"
              :disabled="disabled"
              v-model="user.name"
              @update:modelValue="errors.name = ''"
            />
            <app-input
              typeInput="password"
              :label="$t('admin.login.password')"
              :error="$t(errors.password)"
              :disabled="disabled"
              v-model="user.password"
              @update:modelValue="errors.password = ''"
            />
          </div>
          <div class="login-form__actions">
            <dropdown-language />
            <app-button
              class="login-form__button"
              buttonType="submit"
              :disabled="disabled"
              :text="$t('admin.login.login')"
              :loading="getLoader"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import AppInput from "@/components/elements/AppInput";
import AppButton from "@/components/elements/AppButton";
import DropdownLanguage from "@/components/DropdownLanguage";
import { TEST_USER } from "@/consts";
import { ERRORS_MESSAGE_CODES } from "@/consts/errors";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Login",
  components: {
    AppInput,
    AppButton,
    DropdownLanguage,
  },
  data: () => ({
    user: {
      name: "",
      password: "",
    },
    errors: {
      name: "",
      password: "",
    },
    disabled: false,
  }),
  computed: {
    ...mapGetters({
      getLoader: "user/getLoader",
    }),
  },
  methods: {
    ...mapActions({
      login: "user/login",
      testUserLogin: "user/testUserLogin",
    }),
    validate(user) {
      let isValid = true;

      if (!user.name) {
        this.errors.name = `errors.${ERRORS_MESSAGE_CODES.NAME_EMPTY}`;
        isValid = false;
      }
      if (!user.password) {
        this.errors.password = `errors.${ERRORS_MESSAGE_CODES.PASSWORD_EMPTY}`;
        isValid = false;
      }

      if (user.password && user.password.length < 6) {
        this.errors.password = `errors.${ERRORS_MESSAGE_CODES.PASSWORD_LENGTH_LESS_MIN}`;
        isValid = false;
      }

      return isValid;
    },
    async loginHandler() {
      if (!this.validate(this.user)) {
        return;
      }
      const result = await this.login(this.user);
      if (result && result.messageCodes) {
        return;
      }
      this.$router.push("/");
    },

    async redirectTestUser() {
      await this.testUserLogin();
      this.$router.push(this.$route.query.to);
    },

    fillTestUser() {
      let index = 0;
      this.disabled = true;
      const splitName = TEST_USER.name.split("");
      const splitPassword = TEST_USER.password.split("");

      const interval = setInterval(async () => {
        const { name, password } = this.user;

        if (name === TEST_USER.name && password === TEST_USER.password) {
          clearInterval(interval);
          this.redirectTestUser();
          return;
        }

        this.user.name += splitName[index] || "";
        this.user.password += splitPassword[index] || "";
        index++;
      }, 50);
    },
  },

  mounted() {
    if (this.$route.query.testUser) {
      this.fillTestUser();
    }
  },
};
</script>

<style lang="scss" scoped>
.login {
  position: relative;

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px 0;
  }

  &__title {
    text-align: center;
    font-size: 24px;
    font-weight: 500;
    color: #fff;
    margin-bottom: 50px;
  }

  &-form {
    background-color: #f7fafc;
    border-radius: 6px;
    padding: 24px;
    width: 445px;

    &__body {
      margin-bottom: 10px;
    }

    &__title {
      font-size: 18px;
      text-align: center;
      margin-bottom: 25px;
    }

    &__actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
