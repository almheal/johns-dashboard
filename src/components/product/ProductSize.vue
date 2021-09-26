<template>
  <div class="size">
    <div class="size__number" v-if="number">{{ number }}</div>
    <div class="size__cross" @click="$emit('removeSize', id)">
      <app-cross-icon class="cross-icon" />
    </div>
    <div class="size__row">
      <app-input
        class="size__input"
        :label="$t('admin.utils.size')"
        :modelValue="sizeTitle"
        @update:modelValue="$emit('update:sizeTitle', $event)"
      />
      <app-input
        class="size__input"
        :label="$t('admin.utils.unit')"
        :modelValue="sizeUnit"
        @update:modelValue="$emit('update:sizeUnit', $event)"
      />
      <app-input
        class="size__input"
        :label="$t('app.numberPersons.title')"
        :modelValue="persons"
        @update:modelValue="$emit('update:persons', $event)"
      />
      <app-input
        class="size__input"
        :label="$t('admin.utils.price')"
        :modelValue="price"
        :required="true"
        :error="priceError"
        @update:modelValue="$emit('update:price', $event)"
      />
    </div>
    <div class="size__row">
      <app-input
        class="size__input"
        :label="$t('app.nutritionalValue.proteins')"
        :modelValue="proteins"
        @update:modelValue="$emit('update:proteins', $event)"
      />
      <app-input
        class="size__input"
        :label="$t('app.nutritionalValue.fats')"
        :modelValue="fats"
        @update:modelValue="$emit('update:fats', $event)"
      />
      <app-input
        class="size__input"
        :label="$t('app.nutritionalValue.carbohydrates')"
        :modelValue="carbohydrates"
        @update:modelValue="$emit('update:carbohydrates', $event)"
      />
      <app-input
        class="size__input"
        :label="$t('app.nutritionalValue.energyValue')"
        :modelValue="energyValue"
        @update:modelValue="$emit('update:energyValue', $event)"
      />
      <app-input
        class="size__input"
        :label="$t('app.nutritionalValue.weight')"
        :modelValue="weight"
        @update:modelValue="$emit('update:weight', $event)"
      />
    </div>
  </div>
</template>

<script>
import AppInput from "@/components/elements/AppInput";
import AppCrossIcon from "@/components/icons/AppCrossIcon";

export default {
  name: "ProductSize",
  components: {
    AppInput,
    AppCrossIcon,
  },
  props: {
    number: {
      type: [String, Number],
      default: "",
    },
    id: {
      type: [String, Number],
      default: "",
    },
    sizeTitle: {
      type: String,
      default: "",
    },
    sizeUnit: {
      type: String,
      default: "",
    },
    price: {
      type: String,
      default: "",
    },
    priceError: {
      type: String,
      default: "",
    },
    persons: {
      type: String,
      default: "",
    },
    proteins: {
      type: String,
      default: "",
    },
    fats: {
      type: String,
      default: "",
    },
    carbohydrates: {
      type: String,
      default: "",
    },
    energyValue: {
      type: String,
      default: "",
    },
    weight: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.size {
  position: relative;
  padding: 20px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #9ca3af;
  &__row {
    display: flex;
  }

  &__title {
    font-size: 18px;
  }

  &__number {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    position: absolute;
    left: 5px;
    top: 5px;
    color: #fff;
    font-weight: 500;
    background-color: #4f46e5;
  }

  &__cross {
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 0px;
    z-index: 500;
    cursor: pointer;
    &:hover {
      .cross-icon {
        fill: #ef4444;
      }
    }
  }

  &__input {
    margin-right: 15px;
    &:last-child {
      margin-right: 0;
    }
  }
}

.cross-icon {
  width: 16px;
  height: 16px;
  transition: fill 0.3s;
}
</style>
