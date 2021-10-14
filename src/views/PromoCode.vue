<template>
  <div class="promo-code">
    <div class="promo-code__inner">
      <h1 class="promo-code__title">
        {{ $t(`admin.promoCodes.${isEdit ? "editing" : "creation"}`) }}
      </h1>
      <form class="promo-code__form" @submit.prevent="createHandler">
        <app-input
          :label="$t('admin.utils.title')"
          :error="$t(errors.code)"
          v-model="promoCode.code"
          @update:modelValue="errors.code = ''"
        />
        <div class="promo-code__row">
          <app-input
            class="margin_right-15"
            :label="$t('admin.promoCodes.discount')"
            :error="$t(errors.discount)"
            v-model="promoCode.discount"
            @update:modelValue="errors.discount = ''"
          />
          <app-checkbox
            class="promo-code__checkbox"
            :label="$t('admin.promoCodes.percent')"
            v-model="promoCode.percent"
          />
        </div>
        <app-dropdown
          class="promo-code__dropdown"
          :placeholder="$t('admin.utils.categories')"
          :items="categories"
          :multiSelect="true"
          :multiSelectedItems="promoCode.categories"
          :toShow="(category) => $t(category?.title || '')"
          @selectItem="selectCategoryHandler"
        />
        <app-dropdown
          class="promo-code__dropdown"
          :placeholder="$t('admin.utils.products')"
          :items="productsBySelectedCategories"
          :multiSelect="true"
          :multiSelectedItems="promoCode.products"
          :toShow="(product) => $t(product?.title || '')"
          @selectItem="(products) => (promoCode.products = products)"
        />
        <app-button
          class="promo-code__button"
          buttonType="submit"
          :text="$t(`admin.utils.${isEdit ? 'edit' : 'create'}`)"
          :loading="loader"
        />
      </form>
    </div>
  </div>
</template>

<script>
import AppInput from "@/components/elements/AppInput";
import AppCheckbox from "@/components/elements/AppCheckbox";
import AppButton from "@/components/elements/AppButton";
import AppDropdown from "@/components/elements/AppDropdown";
import { resetObjProperties } from "@/utils";
import { mapActions, mapState } from "vuex";

export default {
  name: "PromoCode",
  components: {
    AppInput,
    AppCheckbox,
    AppButton,
    AppDropdown,
  },
  data: () => ({
    promoCode: {
      code: "",
      discount: "",
      percent: true,
      categories: [],
      products: [],
    },
    loader: false,
    accessActions: ["create", "edit"],
    errors: {
      code: "",
      discount: "",
    },
  }),
  computed: {
    ...mapState({
      products: (state) => state.product.items,
      promoCodeItem: (state) => state.promoCode.item,
      categories: (state) => state.category.items,
    }),
    getRouteAction() {
      return this.$route.params.action;
    },
    isEdit() {
      return this.getRouteAction === "edit" ? true : false;
    },
    editId() {
      return this.$route.query.id;
    },
    productsBySelectedCategories() {
      if (!this.promoCode.categories.length) {
        return this.products;
      }

      return this.promoCode.categories.reduce((acc, category) => {
        for (let i = 0; i < this.products.length; i++) {
          if (this.products[i].category._id === category._id) {
            acc.push(this.products[i]);
          }
        }
        return acc;
      }, []);
    },
  },
  methods: {
    ...mapActions({
      getAllProducts: "product/getAllItems",
      getAllCategories: "category/getAllItems",
      getOnePromoCode: "promoCode/getItem",
      createPromoCode: "promoCode/createItem",
      updatePromoCode: "promoCode/updateItem",
    }),
    selectCategoryHandler(categories) {
      this.promoCode.categories = categories;
      this.promoCode.products = this.promoCode.products.filter((product) => {
        const isCategory = categories.some(
          (category) => category._id === product.category._id
        );
        if (isCategory) {
          return product;
        }
      });
    },
    takeIdsFromArray(arr) {
      return arr.map((item) => item._id);
    },
    async createHandler() {
      const isValid = this.validate();

      if (!isValid) {
        return;
      }

      const categoriesIds = this.takeIdsFromArray(this.promoCode.categories);
      const productsIds = this.takeIdsFromArray(this.promoCode.products);
      const promoCodeForRequest = {
        ...this.promoCode,
        categories: categoriesIds,
        products: productsIds,
      };
      this.loader = true;

      if (this.isEdit) {
        await this.updatePromoCode({
          id: this.editId,
          body: promoCodeForRequest,
        });
      } else {
        await this.createPromoCode({ body: promoCodeForRequest });
        this.promoCode = resetObjProperties(this.promoCode);
      }

      this.loader = false;
    },
    validate() {
      let isValid = true;
      if (!this.promoCode.code) {
        this.errors.code = "admin.utils.requiredField";
        isValid = false;
      }
      if (!this.promoCode.discount) {
        this.errors.discount = "admin.utils.requiredField";
        isValid = false;
      }
      return isValid;
    },
  },
  async mounted() {
    if (!this.accessActions.includes(this.getRouteAction)) {
      this.$router.push("/promo-codes");
    }

    if (this.isEdit && !this.editId) {
      this.$router.push("/promo-code/create");
    }
    this.getAllCategories();
    this.getAllProducts();

    if (this.isEdit) {
      this.loader = true;
      await this.getOnePromoCode({ query: { id: this.editId }, setItem: true });
      this.loader = false;
      const copyPromoCodeItem = JSON.parse(JSON.stringify(this.promoCodeItem));
      this.promoCode = copyPromoCodeItem;
    }
  },
};
</script>

<style lang="scss" scoped>
.promo-code {
  &__title {
    margin-bottom: 20px;
  }

  &__form {
    max-width: 450px;
  }

  &__row {
    display: flex;
    align-items: flex-start;
  }

  &__button {
    margin-top: 33px;
  }

  &__dropdown {
    padding: 10px 0;
    align-items: initial;
  }

  &__checkbox {
    margin-top: 34px;
  }

  &__button {
    margin-top: 10px;
  }
}

.margin_right-15 {
  margin-right: 15px;
}
</style>
