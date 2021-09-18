<template>
  <div class="app-modal" @click.stop="close">
    <div class="app-modal__body" @click.stop>
      <div class="app-modal__header">
        <h4 class="app-modal__title">{{ title }}</h4>
        <div class="app-modal__cross" @click.stop="close">
          <app-cross-icon class="app-modal__icon" />
        </div>
      </div>
      <div class="app-modal__text">
        <p>{{ text }}</p>
      </div>
      <div class="app-modal__actions" v-if="buttons.length">
        <app-button
          class="app-modal__button"
          v-for="(button, index) in buttons"
          :key="index"
          :text="button.text"
          :loading="button.loading"
          @clickButton="button.fn(buttons.params)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AppCrossIcon from "@/components/icons/AppCrossIcon";
import AppButton from "@/components/elements/AppButton";

export default {
  name: "AppInformationModal",
  components: {
    AppCrossIcon,
    AppButton,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
    buttons: {
      type: Array,
      default: () => [],
    },
    close: {
      type: Function,
      default: () => {},
    },
  },
};
</script>

<style lang="scss" scoped>
.app-modal {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 30px;

  &__body {
    width: 448px;
    padding: 21px 14px;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.25);
    animation: fly 0.4s;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  &__title {
    font-size: 21px;
    font-weight: 600;
  }

  &__cross {
    cursor: pointer;

    &:hover {
      .app-modal__icon {
        color: rgb(239, 68, 68);
      }
    }
  }

  &__icon {
    width: 24px;
    height: 24px;
    transition: color 0.3s;
  }

  &__text {
    font-size: 16px;
    margin-bottom: 25px;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  &__button {
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
}

@keyframes fly {
  0% {
    transform: translateY(-300%);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
