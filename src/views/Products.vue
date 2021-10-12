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
          @clickCross="openDeleteModal"
        />
        <app-pagination
          class="products__pagination"
          :length="productsAllLength"
          :limit="DEFAULT_LIMIT"
          @changePage="getProductsByLimit"
        />
      </div>
    </div>
    <app-information-modal
      v-if="deleteItemId"
      :title="$t('admin.confirmDelete.title')"
      :text="`${$t('admin.confirmDelete.text')}?`"
      :buttons="buttonsModalDelete"
      :close="closeModal"
    />
  </div>
</template>

<script>
import AppButton from "@/components/elements/AppButton";
import AppTable from "@/components/elements/AppTable";
import AppPagination from "@/components/elements/AppPagination";
import AppInformationModal from "@/components/elements/AppInformationModal";
import TableActionsMixin from "@/mixins/TableActionsMixin";
import { calculatePagination } from "@/utils";
import { mapActions, mapState } from "vuex";

export default {
  name: "Products",
  components: {
    AppButton,
    AppTable,
    AppPagination,
    AppInformationModal,
  },
  mixins: [TableActionsMixin],
  data: () => ({
    DEFAULT_LIMIT: 10,
  }),
  computed: {
    ...mapState({
      getProducts: (state) => state.product.items,
      getItemsLoader: (state) => state.product.getItemsLoader,
      deleteLoader: (state) => state.product.deleteLoader,
      productsAllLength: (state) => state.product.lengthAllItems,
    }),
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
          title: this.$t("app.tags.title"),
        },
        {
          title: this.$t("admin.utils.category"),
        },
      ];
    },
    rows() {
      return this.getProducts.map((product) => {
        const varietyTitles = product.options
          .reduce((acc, option) => {
            if (option.variety) {
              acc.push(this.$t(option.variety));
            }
            return acc;
          }, [])
          .join(",");
        return {
          item: product,
          cells: [
            {
              title: this.$t(product.title),
            },
            {
              title: varietyTitles,
            },
            {
              title: product.features
                .map((feature) => this.$t(feature.title))
                .join(","),
            },
            {
              title: product.tags.map((tag) => this.$t(tag.title)).join(","),
            },
            {
              title: this.$t(product.category.title),
            },
          ],
        };
      });
    },
    currentPage() {
      return this.$route.query.page;
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
    async deleteItemHandler() {
      await this.deleteItem({ id: this.deleteItemId });
      this.closeModal();
    },
    async getProductsByLimit() {
      const { skip, limit } = calculatePagination({
        limit: this.DEFAULT_LIMIT,
        page: this.currentPage,
      });

      this.getAllProducts({ skip, limit });
    },
  },
  mounted() {
    this.getProductsByLimit();
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

  &__pagination {
    margin: 30px auto 0;
  }
}
</style>
