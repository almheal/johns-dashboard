<template>
  <div class="product">
    <div class="product__inner">
      <h1 class="product__title">{{ $t("admin.product.creation") }}</h1>
      <div class="product__body">
        <form
          class="product-form"
          v-if="!isLoading"
          @submit.prevent="productHandler"
        >
          <div class="product-form__row">
            <div class="product-form__column">
              <app-input
                saveKey="product"
                saveProperty="title"
                :label="$t('admin.utils.title')"
                v-model="product.title"
              />
              <app-dropdown
                class="product-form__dropdown"
                saveKey="product"
                saveProperty="category"
                :fullWidth="true"
                :placeholder="$t('admin.product.selectCategory')"
                :items="getCategories"
                :toShow="
                  (category) => (category?.title ? $t(category.title) : '')
                "
                :selectedItem="product.category"
                @selectItem="(category) => (product.category = category)"
              />
              <app-dropdown
                class="product-form__dropdown"
                saveKey="product"
                saveProperty="tags"
                :fullWidth="true"
                :placeholder="$t('admin.product.selectTags')"
                :multiSelect="true"
                :multiSelectedItems="product.tags"
                :items="getTags"
                :toShow="(tag) => (tag?.title ? $t(tag.title) : '')"
                @selectItem="(tags) => (product.tags = tags)"
              />
              <app-dropdown
                class="product-form__dropdown"
                saveKey="product"
                saveProperty="features"
                :fullWidth="true"
                :placeholder="$t('admin.product.selectFeatures')"
                :multiSelect="true"
                :multiSelectedItems="product.features"
                :items="getFeatures"
                :toShow="(feature) => (feature?.title ? $t(feature.title) : '')"
                @selectItem="(features) => (product.features = features)"
              />
              <app-dropdown
                class="product-form__dropdown"
                saveKey="product"
                saveProperty="ingredients"
                :fullWidth="true"
                :placeholder="$t('admin.product.selectIngredients')"
                :multiSelect="true"
                :multiSelectedItems="product.ingredients"
                :items="getIngredients"
                :toShow="
                  (ingredient) =>
                    ingredient?.title ? $t(ingredient.title) : ''
                "
                @selectItem="
                  (ingredients) => (product.ingredients = ingredients)
                "
              />
            </div>
            <div class="product-form__column">
              <app-textarea
                saveKey="product"
                saveProperty="description"
                :label="$t('admin.product.description')"
                v-model="product.description"
              />
            </div>
          </div>
          <product-variety
            v-for="(option, index) in product.options"
            :key="index"
            :option="option"
            :number="index + 1"
            :id="option.id"
            v-model:optionVariety="option.variety"
            v-model:optionImg="option.img"
            v-model:previewImgVariety="option.previewImgVariety"
            v-model:imgUrl="option.imgUrl"
            @removeVariety="removeVarietyHandler"
          />
          <app-button
            buttonType="button"
            :text="$t('admin.product.addVariety')"
            @clickButton="addVariety"
          />
        </form>
        <app-circle-loader
          class="product__loader"
          v-else
          color="blue"
          size="large"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AppInput from "@/components/elements/AppInput";
import AppTextarea from "@/components/elements/AppTextarea";
import AppDropdown from "@/components/elements/AppDropdown";
import AppButton from "@/components/elements/AppButton";
import AppCircleLoader from "@/components/elements/AppCircleLoader";
import ProductVariety from "@/components/product/ProductVariety";
import { mapActions, mapState } from "vuex";

export default {
  name: "Product",
  components: {
    AppInput,
    AppTextarea,
    AppDropdown,
    AppButton,
    AppCircleLoader,
    ProductVariety,
  },
  data: () => ({
    product: {
      title: "",
      description: "",
      category: "",
      tags: [],
      features: [],
      ingredients: [],
      options: [
        {
          id: Math.floor(Math.random() * Date.now()),
          variety: "",
          img: "",
          sizes: [],
          previewImgVariety: "",
          iconUrl: "",
        },
      ],
    },
    defaultOption: {
      variety: "",
      img: "",
      sizes: [],
      previewImgVariety: "",
      imgUrl: "",
    },
    defaultSize: {
      size: {
        title: "",
        unit: "",
      },
      persons: "",
      price: "",
      nutritionalValue: {
        proteins: "",
        fats: "",
        carbohydrates: "",
        energyValue: "",
        weight: "",
      },
    },
    isLoading: false,
  }),
  computed: {
    ...mapState({
      getCategories: (state) => state.category.items,
      getTags: (state) => state.tag.items,
      getFeatures: (state) => state.feature.items,
      getIngredients: (state) => state.ingredient.items,
    }),
  },
  methods: {
    ...mapActions({
      getAllCategories: "category/getAllItems",
      getAllTags: "tag/getAllItems",
      getAllFeatures: "feature/getAllItems",
      getAllIngredients: "ingredient/getAllItems",
    }),
    productHandler() {
      this.product.title = "";
      this.product.description = "";
      this.product.tags = [];
      this.product.category = "";
      this.product.options = [JSON.parse(JSON.stringify(this.defaultOption))];
      this.product.imgUrl = "";
      console.log(this.product);
    },
    addVariety() {
      this.product.options.push(
        JSON.parse(
          JSON.stringify({
            ...this.defaultOption,
            id: Math.floor(Math.random() * Date.now()),
          })
        )
      );
    },
    removeVarietyHandler(id) {
      this.product.options = this.product.options.filter(
        (option) => option.id !== id
      );
    },
  },
  async mounted() {
    this.isLoading = true;
    await Promise.all([
      this.getAllCategories(),
      this.getAllTags(),
      this.getAllFeatures(),
      this.getAllIngredients(),
    ]);
    this.isLoading = false;
  },
};
</script>

<style lang="scss" scoped>
.product {
  &__title {
    margin-bottom: 25px;
  }

  &__inner {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &__body {
    position: relative;
    flex: 1 1 0;
  }

  &__loader {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  &-form {
    &__row {
      display: flex;
    }

    &__column {
      flex: 1 1 0;
      margin-right: 50px;
      &:last-child {
        margin-right: 0;
      }
    }

    &__dropdown {
      margin-bottom: 18px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
