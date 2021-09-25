<template>
  <div class="products">
    <div class="products__inner">
      <h1 class="products__title">{{ $t("admin.menu.goods") }}</h1>
      <app-button
        class="products__button"
        :text="$t('admin.utils.create')"
        @clickButton="toProductByAction('create')"
      />
      <div class="products__body">
        <app-table :columns="columns" />
        <app-pagination />
      </div>
    </div>
  </div>
</template>

<script>
import AppButton from "@/components/elements/AppButton";
import AppTable from "@/components/elements/AppTable";
import AppPagination from "@/components/elements/AppPagination";
import { mapActions } from "vuex";

export default {
  name: "Products",
  components: {
    AppButton,
    AppTable,
    AppPagination,
  },
  computed: {
    columns() {
      return [
        {
          title: this.$t("admin.utils.title"),
        },
        {
          title: this.$t("app.varieties.title"),
        },
        {
          title: this.$t("app.features.title"),
        },
        {
          title: this.$t("admin.utils.category"),
        },
      ];
    },
  },
  methods: {
    ...mapActions({
      getAllProducts: "product/getAllItems",
    }),
    toProductByAction(action) {
      this.$router.push(`/products/${action}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.products {
  &__inner {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  &__button {
    margin: 0 0 10px auto;
  }

  &__body {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>
