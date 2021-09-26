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
                :required="true"
                :label="$t('admin.utils.title')"
                :error="$t(errors.title)"
                v-model="product.title"
                @update:modelValue="errors.title = ''"
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
            :imgError="$t(errors.img[option.id] || '')"
            v-model:optionVariety="option.variety"
            v-model:optionImg="option.img"
            @update:optionImg="errors.img[option.id] = ''"
            @removeVariety="removeVarietyHandler"
            @input="optionsSaveLocaleStorage"
          >
            <product-size
              v-for="(size, index) in option.sizes"
              :key="index"
              :number="index + 1"
              :id="size.id"
              :priceError="$t(errors.price[size.id] || '')"
              v-model:sizeTitle="size.size.title"
              v-model:sizeUnit="size.size.unit"
              v-model:persons="size.persons"
              v-model:price="size.price"
              v-model:proteins="size.nutritionalValue.proteins"
              v-model:fats="size.nutritionalValue.fats"
              v-model:carbohydrates="size.nutritionalValue.carbohydrates"
              v-model:energyValue="size.nutritionalValue.energyValue"
              v-model:weight="size.nutritionalValue.weight"
              @removeSize="(id) => removeSizeHandler(id, option)"
              @update:price="errors.price[size.id] = ''"
              @input="optionsSaveLocaleStorage"
            />
            <app-button
              :text="$t('admin.product.addSize')"
              @clickButton="addSize(option)"
            />
          </product-variety>
          <app-button
            buttonType="button"
            :text="$t('admin.product.addVariety')"
            @clickButton="addVariety(defaultOption)"
          />
          <app-button
            class="product-form__create"
            buttonType="submit"
            :text="$t('admin.utils.create')"
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
import ProductSize from "@/components/product/ProductSize";
import { mapActions, mapState } from "vuex";
import { requestCreateImage } from "@/services/image.service";
import {
  setDynamicItemLocalStorage,
  getDynamicPropertyLocalStorage,
  resetObjProperties,
  setLocalStorage,
} from "@/utils";
import { ERRORS_MESSAGE_CODES } from "@/consts/errors";

export default {
  name: "Product",
  components: {
    AppInput,
    AppTextarea,
    AppDropdown,
    AppButton,
    AppCircleLoader,
    ProductVariety,
    ProductSize,
  },
  data: () => ({
    product: {
      title: "",
      description: "",
      category: "",
      tags: [],
      features: [],
      ingredients: [],
      options: [],
    },
    defaultOption: {
      variety: "",
      img: "",
      sizes: [],
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
    errors: {
      title: "",
      price: {},
      img: {},
    },
    isLoading: false,
  }),
  computed: {
    ...mapState({
      getCategories: (state) => state.category.items,
      getTags: (state) => state.tag.items,
      getFeatures: (state) => state.feature.items,
      getIngredients: (state) => state.ingredient.items,
      getProduct: (state) => state.product.item,
    }),
    // current action from route
    getRouteAction() {
      return this.$route.params.action;
    },
    getEditId() {
      return this.$route.query.id;
    },
  },
  methods: {
    ...mapActions({
      getAllCategories: "category/getAllItems",
      getAllTags: "tag/getAllItems",
      getAllFeatures: "feature/getAllItems",
      getAllIngredients: "ingredient/getAllItems",
      createProduct: "product/createItem",
      updateProduct: "product/updateItem",
      getOneProduct: "product/getItem",
    }),
    async productHandler() {
      //validate and set errors
      const isValid = this.validate();
      if (!isValid) {
        return;
      }

      //copy product for creation
      const product = JSON.parse(JSON.stringify(this.product));

      //take from object property _id
      product.tags = this.takeIdsFromArray(product.tags);
      product.features = this.takeIdsFromArray(product.features);
      product.ingredients = this.takeIdsFromArray(product.ingredients);
      product.category = product.category._id;

      //create image for every option
      product.options = await this.createProductImages(this.product.options);
      if (this.getRouteAction === "create") {
        const { messageCodes } = await this.createProduct({ body: product });
        if (!messageCodes) {
          this.resetProductToDefault();
        }
      }
    },
    async createProductImages(options) {
      const optionsWithImages = options.map(async (option) => {
        // if the typeof is equal to the object, then the value contains a file and we creation img url for option
        if (typeof option.img === "object") {
          const { data: imgUrl } = await requestCreateImage(option.img);
          const copyOption = JSON.parse(JSON.stringify(option));
          copyOption.img = imgUrl;
          return copyOption;
        }
        return option;
      });
      return await Promise.all(optionsWithImages);
    },
    takeIdsFromArray(array) {
      return array.map((item) => item._id);
    },
    copyProductForEdit() {},
    // save product options to local storage
    optionsSaveLocaleStorage() {
      const copyProduct = JSON.parse(JSON.stringify(this.product));

      // resetting pictures because after converting the file to a string, an empty object remains
      copyProduct.options.forEach((option) => (option.img = ""));

      setDynamicItemLocalStorage({
        data: copyProduct.options,
        key: "product",
        property: "options",
      });
    },
    // generate random id
    generateId() {
      return Math.floor(Math.random() * Date.now());
    },
    // add new default option with id
    addVariety(option) {
      const newOption = JSON.parse(
        JSON.stringify({
          ...option,
          id: this.generateId(),
        })
      );
      this.addSize(newOption);
      this.product.options.push(newOption);
      this.optionsSaveLocaleStorage();
    },
    // add new default size with id
    addSize(option) {
      option.sizes.push(
        JSON.parse(
          JSON.stringify({ ...this.defaultSize, id: this.generateId() })
        )
      );
      this.optionsSaveLocaleStorage();
    },
    resetProductToDefault() {
      this.product = resetObjProperties(this.product);
      this.addVariety(this.defaultOption);
      setLocalStorage({ key: "product", data: this.product });
    },
    // validate product, every option, every size. If !options.length then add default option and default size for this option
    validate() {
      let isValid = true;
      if (!this.product.options.length) {
        this.addVariety(this.defaultOption);
      }
      if (!this.product.title) {
        this.errors.title = `errors.${ERRORS_MESSAGE_CODES.PRODUCT_TITLE_EMPTY}`;
        isValid = false;
      }
      this.product.options.forEach((option) => {
        if (!option.img) {
          this.errors.img[
            option.id
          ] = `errors.${ERRORS_MESSAGE_CODES.PRODUCT_IMAGE_EMPTY}`;
          isValid = false;
        }

        if (!option.sizes.length) {
          this.addSize(option);
        }

        for (let i = 0; i < option.sizes.length; i++) {
          if (!option.sizes[i].price) {
            isValid = false;
            this.errors.price[
              option.sizes[i].id
            ] = `errors.${ERRORS_MESSAGE_CODES.PRODUCT_PRICE_EMPTY}`;
          }
        }
      });
      return isValid;
    },
    // remove variety by id
    removeVarietyHandler(id) {
      this.product.options = this.product.options.filter(
        (option) => option.id !== id
      );
      this.optionsSaveLocaleStorage();
    },
    // remove size by id
    removeSizeHandler(id, option) {
      option.sizes = option.sizes.filter((size) => size.id !== id);
      this.optionsSaveLocaleStorage();
    },
  },
  async mounted() {
    if (this.getRouteAction === "edit" && !this.getEditId) {
      this.$router.replace({
        params: {
          action: "create",
        },
      });
    }
    this.isLoading = true;
    // waiting for every items to create a product
    await Promise.all([
      this.getAllCategories(),
      this.getAllTags(),
      this.getAllFeatures(),
      this.getAllIngredients(),
    ]);

    if (this.getRouteAction === "edit") {
      await this.getOneProduct({
        id: this.getEditId,
        setItem: true,
        addNew: false,
      });
      console.log(this.getProduct);
    }

    this.isLoading = false;

    // get saved product from local storage
    const options = getDynamicPropertyLocalStorage({
      key: "product",
      property: "options",
      defaultValue: [],
    });
    this.product.options = options;

    if (!this.product.options.length) {
      this.addVariety(this.defaultOption);
      this.addSize(this.product.options[0]);
    }
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
      margin-bottom: 20px;
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

    &__create {
      margin: 25px 0 0 auto;
    }
  }
}
</style>
