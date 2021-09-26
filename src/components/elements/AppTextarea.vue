<template>
  <div class="textarea__wrapper">
    <label :for="dynamicId" class="app-textarea__label" v-if="label">
      {{ label }}
    </label>
    <textarea
      class="app-textarea"
      :id="dynamicId"
      :placeholder="placeholder"
      :value="modelValue"
      @input="textareaHandler"
    ></textarea>
    <div class="app-textarea__error" v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import {
  setDynamicItemLocalStorage,
  getDynamicPropertyLocalStorage,
} from "@/utils";

export default {
  name: "AppTextarea",
  props: {
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    modelValue: {
      type: String,
      default: "",
    },
    error: {
      type: String,
      default: "",
    },
    saveKey: {
      type: String,
      default: "",
    },
    saveProperty: {
      type: String,
      default: "",
    },
  },
  computed: {
    dynamicId() {
      const id = Math.floor((Date.now() * Math.random()) / Math.random());
      return id;
    },
  },
  watch: {
    modelValue(value) {
      if (this.saveKey && this.saveProperty) {
        setDynamicItemLocalStorage({
          key: this.saveKey,
          property: this.saveProperty,
          data: value,
        });
      }
    },
  },
  methods: {
    textareaHandler(e) {
      this.$emit("update:modelValue", e.target.value);
      if (this.saveKey && this.saveProperty) {
        setDynamicItemLocalStorage({
          key: this.saveKey,
          property: this.saveProperty,
          data: e.target.value,
        });
      }
    },
  },
  mounted() {
    if (this.saveKey && this.saveProperty) {
      this.$emit(
        "update:modelValue",
        getDynamicPropertyLocalStorage({
          key: this.saveKey,
          property: this.saveProperty,
        })
      );
    }
  },
};
</script>

<style lang="scss" scoped>
.textarea-wrapper {
  padding: 10px 0;
}

.app-textarea {
  display: inline-block;
  font-size: 16px;
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid rgb(229, 231, 235);
  resize: vertical;
  max-height: 300px;
  min-height: 100px;
  // vertical-align: middle;
  transition: 0.2s;

  &:focus {
    border-color: rgb(79, 70, 229);
    box-shadow: 0px 0px 0px 3px rgba(99, 102, 241, 0.4);
    transition: 0.2s;
  }

  &__label {
    display: block;
    margin-bottom: 7px;
  }

  &__error {
    margin: 7px 0;
    color: #c21313;
  }
}
</style>
