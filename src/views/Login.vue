<template>
  <div class="login">
    <div class="container">
      <div class="login__inner">
        <h1 class="login__title">{{ $t("admin.login.welcome") }}</h1>
        <form class="login-form" @submit.prevent="loginHandler">
          <h3 class="login-form__title">{{ $t("admin.login.title") }}</h3>
          <div class="login-form__body">
            <app-input
              label="admin.login.username"
              v-model="user.name"
              :error="errors.name"
            />
            <app-input
              label="admin.login.password"
              typeInput="password"
              v-model="user.password"
              :error="errors.password"
            />
          </div>
          <div class="login-form__actions">
            <dropdown-language />
            <app-button
              class="login-form__button"
              text="admin.login.login"
              buttonType="submit"
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
import DropdownLanguage from "@/components/language/DropdownLanguage";
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
  }),
  computed: {
    ...mapGetters({
      getLoader: "user/getLoader",
    }),
  },
  watch: {
    "user.name"() {
      if (this.errors.name) {
        this.errors.name = "";
      }
    },
    "user.password"() {
      if (this.errors.password) {
        this.errors.password = "";
      }
    },
  },
  methods: {
    ...mapActions({
      login: "user/login",
    }),
    validate(user) {
      let isValid = true;

      if (!user.name) {
        this.errors.name = "Обязательное поле";
        isValid = false;
      }
      if (!user.password) {
        this.errors.password = "Обязательное поле";
        isValid = false;
      }

      if (user.password && user.password.length < 6) {
        this.errors.password = "Минимальная длина 6 символов";
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
