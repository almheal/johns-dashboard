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
        <app-table
          :columns="columns"
          :rows="rows"
          :loading="getItemsLoader"
          :cross="true"
          :edit="true"
          @clickEdit="(row) => toProductByAction(`edit?id=${row.item._id}`)"
          @clickCross="(row) => deleteItem({ id: row.item._id })"
        />
        <app-pagination />
      </div>
    </div>
  </div>
</template>

<script>
import AppButton from "@/components/elements/AppButton";
import AppTable from "@/components/elements/AppTable";
import AppPagination from "@/components/elements/AppPagination";
import { mapActions, mapState } from "vuex";

export default {
  name: "Products",
  components: {
    AppButton,
    AppTable,
    AppPagination,
  },
  computed: {
    ...mapState({
      getProducts: (state) => state.product.items,
      getItemsLoader: (state) => state.product.getItemsLoader,
    }),
    columns() {
      return [
        {
          title: this.$t("admin.utils.title"),
        },
        // {
        //   title: this.$t("app.varieties.title"),
        // },
        // {
        //   title: this.$t("app.features.title"),
        // },
        // {
        //   title: this.$t("admin.utils.category"),
        // },
      ];
    },
    rows() {
      return this.getProducts.map((product) => {
        return {
          item: product,
          cells: [
            {
              title: this.$t(product.title),
            },
            // {
            //   title: this.$t(product.options[0]?.variety || ""),
            // },
          ],
        };
      });
    },
  },
  methods: {
    ...mapActions({
      getAllProducts: "product/getAllItems",
      deleteItem: "product/deleteItem",
    }),
    toProductByAction(action) {
      this.$router.push(`/products/${action}`);
    },
  },
  mounted() {
    this.getAllProducts();
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
