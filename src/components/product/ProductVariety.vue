<template>
  <div class="variety">
    <div class="variety__number" v-if="number">{{ number }}</div>
    <div class="variety__cross" @click="$emit('removeVariety', id)">
      <app-cross-icon class="cross-icon" />
    </div>
    <div class="variety__row">
      <div class="variety__column">
        <app-input
          :label="$t('admin.product.varietyName')"
          :modelValue="optionVariety"
          @update:modelValue="$emit('update:optionVariety', $event)"
        />
      </div>
      <div class="variety__column">
        <div class="variety__row">
          <app-upload-file
            class="variety__upload"
            :label="$t('admin.utils.image')"
            :modelValue="imgUrl"
            :error="imgError"
            :required="true"
            @changeFile="changeImg"
            @preview="(preview) => (previewImgVariety = preview)"
            @update:modelValue="$emit('update:imgUrl', $event)"
          />
          <div class="variety__preview">
            <img
              class="variety__img"
              v-if="previewImgVariety"
              :src="previewImgVariety"
              alt="variety-img"
            />
          </div>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import AppInput from "@/components/elements/AppInput";
import AppUploadFile from "@/components/elements/AppUploadFile";
import AppCrossIcon from "@/components/icons/AppCrossIcon";

export default {
  name: "ProductVariety",
  components: {
    AppInput,
    AppUploadFile,
    AppCrossIcon,
  },
  props: {
    optionVariety: {
      type: String,
      default: "",
    },
    optionImg: {
      type: String,
      default: "",
    },
    imgError: {
      type: String,
      default: "",
    },
    id: {
      type: [String, Number],
      default: 0,
    },
    imgUrl: {
      type: String,
      default: "",
    },
    number: {
      type: [String, Number],
      default: 0,
    },
  },
  data: () => ({
    previewImgVariety: "",
  }),
  methods: {
    changeImg(formData) {
      this.$emit("update:optionImg", formData);
    },
  },
};
</script>

<style lang="scss" scoped>
.variety {
  position: relative;
  border-radius: 4px;
  border: 1px solid #9ca3af;
  padding: 15px 35px 15px 45px;
  margin-bottom: 20px;

  &__number {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    position: absolute;
    left: 10px;
    top: 10px;
    color: #fff;
    font-weight: 500;
    background-color: #4f46e5;
  }

  &__cross {
    width: 40px;
    height: 40px;
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

  &__row {
    display: flex;
  }

  &__column {
    flex: 1 1 0;
    margin-right: 30px;
    &:last-child {
      margin-right: 0;
    }
  }

  &__upload {
    margin: 0 25px 0 0;
  }

  &__img {
    height: 250px;
    width: 350px;
  }
}

.cross-icon {
  width: 18px;
  height: 18px;
  transition: fill 0.3s;
}
</style>
