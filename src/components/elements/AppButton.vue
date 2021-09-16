<template>
  <button
    class="app-button"
    :class="{ loading: loading }"
    :type="buttonType"
    :disabled="loading || disabled"
    @click="$emit('clickButton')"
  >
    <app-circle-loader class="app-button__loader" v-if="loading" />
    {{ text }}
  </button>
</template>

<script>
import AppCircleLoader from "@/components/elements/AppCircleLoader";

export default {
  name: "AppButton",
  components: {
    AppCircleLoader,
  },
  emits: ["clickButton"],
  props: {
    text: {
      type: String,
      default: "",
    },
    buttonType: {
      type: String,
      default: "button",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.app-button {
  position: relative;
  display: block;
  padding: 9px 16px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  background-color: rgba(79, 70, 229, 1);
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(79, 70, 229, 0.8);
  }

  &.loading {
    color: transparent;
  }

  &__loader {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
