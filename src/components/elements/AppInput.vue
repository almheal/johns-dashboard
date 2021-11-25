<template>
  <div class="input-wrapper">
    <label :for="dynamicId" class="input__label" data-test="label" v-if="label"
      >{{ label }}<span class="input__required" v-if="required">*</span></label
    >
    <input
      class="input"
      data-test="input"
      :class="{ error: error || isError }"
      :type="typeInput"
      :value="modelValue"
      :placeholder="placeholder"
      :id="dynamicId"
      :disabled="disabled"
      @input="inputHandler"
    />
    <div class="input__error" data-test="error" v-if="error">
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
  name: "AppInput",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
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
    saveKey: {
      type: String,
      default: "",
    },
    saveProperty: {
      type: String,
      default: "",
    },
    isSaved: {
      type: Boolean,
      default: false,
    },
    isError: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    dynamicId() {
      const id = (Date.now() * Math.random()) / Math.random();
      return id;
    },
  },
  watch: {
    modelValue(value) {
      if (this.saveKey && this.saveProperty && this.isSaved) {
        setDynamicItemLocalStorage({
          key: this.saveKey,
          property: this.saveProperty,
          data: value,
        });
      }
    },
  },
  methods: {
    inputHandler(e) {
      this.$emit("update:modelValue", e.target.value);
      if (this.saveKey && this.saveProperty && this.isSaved) {
        setDynamicItemLocalStorage({
          key: this.saveKey,
          property: this.saveProperty,
          data: e.target.value,
        });
      }
    },
  },
  mounted() {
    if (this.saveKey && this.saveProperty && this.isSaved) {
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

  &.error {
    box-shadow: 0px 0px 0px 3px rgba(#c21313, 0.4);
  }

  &__required {
    color: #c21313;
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
