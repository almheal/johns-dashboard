<template>
  <div class="input-wrapper">
    <label :for="dynamicId" class="input__label" v-if="label">{{
      $t(label)
    }}</label>
    <input
      :type="typeInput"
      class="input"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <div class="input__error" v-if="error">{{ $t(error) }}</div>
  </div>
</template>

<script>
export default {
  name: "AppInput",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    typeInput: {
      type: String,
      default: "text",
    },
    placeholder: {
      type: String,
      default: "",
    },
    error: {
      type: String,
      default: "",
    },
  },
  computed: {
    dynamicId() {
      const id = (Date.now() * Math.random()) / Math.random();
      return id;
    },
  },
};
</script>

<style lang="scss" scoped>
.input-wrapper {
  padding: 10px 0;
}

.input {
  display: inline-block;
  font-size: 16px;
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid rgb(229, 231, 235);
  transition: 0.2s;

  &:focus {
    border-color: rgb(79, 70, 229);
    box-shadow: 0px 0px 0px 3px rgba(99, 102, 241, 0.4);
    transition: 0.2s;
  }

  &__label {
    display: inline-block;
    margin-bottom: 7px;
  }

  &__error {
    margin: 7px 0;
    color: #c21313;
  }
}
</style>
