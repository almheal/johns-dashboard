<template>
  <div class="editor">
    <textarea
      class="editor__textarea"
      :disabled="disabled || loading"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
    <app-circle-loader
      class="editor__loader"
      v-if="loading"
      color="blue"
      size="large"
    />
  </div>
</template>

<script>
import AppCircleLoader from "@/components/elements/AppCircleLoader";

export default {
  name: "LocaleMessagesEditor",
  components: {
    AppCircleLoader,
  },
  props: {
    modelValue: {
      type: String,
      default: "",
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
.editor {
  position: relative;
  height: 100%;

  &__textarea {
    width: 100%;
    height: 100%;
    resize: none;
    border-radius: 6px;
    font-size: 16px;
    padding: 18px 22px;
    overflow: auto;
    background-color: #fff;
  }

  &__loader {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
