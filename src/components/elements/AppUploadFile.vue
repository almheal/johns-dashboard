<template>
  <div class="app-upload">
    <label class="app-upload__label" :for="dynamicId" v-if="label"
      >{{ label
      }}<span class="app-upload__required" v-if="required">*</span></label
    >
    <app-button
      class="app-upload__button"
      :class="{ 'app-upload__button_margin-bottom': error }"
      :text="$t('admin.utils.upload')"
      @clickButton="triggerInput"
    />
    <input
      class="app-upload__input"
      :id="dynamicId"
      type="file"
      ref="inputFile"
      :value="modelValue"
      @change="changeInput"
    />
    <div class="app-upload__error" v-if="error">{{ error }}</div>
  </div>
</template>

<script>
import AppButton from "@/components/elements/AppButton";

export default {
  name: "AppUploadFile",
  emits: ["changeFile", "preview", "update:modelValue"],
  components: {
    AppButton,
  },
  props: {
    label: {
      type: String,
      default: "",
    },
    error: {
      type: String,
      default: "",
    },
    modelValue: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    triggerInput() {
      this.$refs.inputFile.click();
    },
    changeInput(e) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const reader = new FileReader();

      reader.onload = (ev) => {
        this.$emit("preview", ev.target.result);
      };

      reader.readAsDataURL(file);

      this.$emit("changeFile", formData);
      this.$emit("update:modelValue", e.target.value);
    },
  },
  computed: {
    dynamicId() {
      return (Date.now() * Math.random()) / Math.random();
    },
  },
};
</script>

<style lang="scss" scoped>
.app-upload {
  padding: 10px 0;

  &__label {
    display: inline-block;
    margin-bottom: 7px;
  }

  &__button {
    &_margin-bottom {
      margin-bottom: 10px;
    }
  }

  &__required {
    color: #c21313;
  }

  &__input {
    display: none;
  }

  &__error {
    margin: 7px 0;
    color: #c21313;
  }
}
</style>
