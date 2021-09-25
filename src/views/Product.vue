<template>
  <div class="product">
    <div class="product__inner">
      <h1 class="product__title">{{ $t("admin.product.creation") }}</h1>
      <div class="product__body">
        <form class="product-form" v-if="!isLoading">
          <div class="product-form__row">
            <div class="product-form__column">
              <app-input
                :label="$t('admin.utils.title')"
                v-model="product.title"
              />
              <app-dropdown
                class="product-form__dropdown"
                :fullWidth="true"
                :placeholder="$t('admin.product.selectCategory')"
                :items="getCategories"
                :toShow="
                  (category) => (category.title ? $t(category.title) : '')
                "
                :selectedItem="product.category"
                @selectItem="(category) => (product.category = category)"
              />
              <app-dropdown
                class="product-form__dropdown"
                :fullWidth="true"
                :placeholder="$t('admin.product.selectTags')"
                :items="getTags"
                :toShow="(tag) => (tag.title ? $t(tag.title) : '')"
              />
              <app-dropdown
                class="product-form__dropdown"
                :fullWidth="true"
                :placeholder="$t('admin.product.selectFeatures')"
                :items="getFeatures"
                :toShow="(feature) => (feature.title ? $t(feature.title) : '')"
              />
              <app-dropdown
                class="product-form__dropdown"
                :fullWidth="true"
                :placeholder="$t('admin.product.selectIngredients')"
                :items="getIngredients"
                :toShow="
                  (ingredient) => (ingredient.title ? $t(ingredient.title) : '')
                "
              />
            </div>
            <div class="product-form__column">
              <app-textarea
                :label="$t('admin.product.description')"
                v-model="product.description"
              />
            </div>
          </div>
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
import AppCircleLoader from "@/components/elements/AppCircleLoader";
import { mapActions, mapState } from "vuex";

export default {
  name: "Product",
  components: {
    AppInput,
    AppTextarea,
    AppDropdown,
    AppCircleLoader,
  },
  data: () => ({
    product: {
      title: "",
      description: "",
      category: "",
      tags: [],
      features: [],
      ingredients: [],
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
