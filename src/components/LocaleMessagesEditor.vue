<template>
  <div class="editor">
    <textarea
      class="editor__textarea"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
  </div>
</template>

<script>
export default {
  name: "LocaleMessagesEditor",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.editor {
  height: 100%;

  &__textarea {
    width: 100%;
    height: 100%;
    resize: none;
    border-radius: 6px;
    font-size: 16px;
    padding: 18px 22px;
    overflow: auto;
  }
}
</style>
