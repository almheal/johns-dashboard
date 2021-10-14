<template>
  <label class="checkbox label" :for="dynamicId">
    <input
      class="input"
      :id="dynamicId"
      :value="modelValue"
      :checked="modelValue"
      type="checkbox"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span class="checkbox__customize">
      <app-check-mark-icon class="checkbox__mark" />
    </span>
    <label class="label" :for="dynamicId" v-if="label">{{ label }}</label>
  </label>
</template>

<script>
import AppCheckMarkIcon from "@/components/icons/AppCheckMarkIcon";

export default {
  name: "AppCheckBox",
  components: {
    AppCheckMarkIcon,
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
  },
  computed: {
    dynamicId() {
      return Math.floor(Date.now() * Math.random());
    },
  },
};
</script>

<style lang="scss" scoped>
.label {
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  font-weight: 400;
  transition: 0.3s;
  &:hover {
    color: #4f46e5;
  }
}
.checkbox {
  display: flex;
  align-items: center;
  &__customize {
    position: relative;
    width: 18px;
    height: 18px;
    border: 2px solid #4f46e5;
    border-radius: 4px;
    margin-right: 10px;
    transition: 0.3s;
  }
  &__mark {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    opacity: 0;
  }
}
.input {
  position: absolute;
  z-index: -1;
  opacity: 0;
  &:checked + .checkbox__customize {
    background-color: #4f46e5;
    border-color: #4f46e5;
    .checkbox__mark {
      opacity: 1;
    }
  }
}
</style>
