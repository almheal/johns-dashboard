<template>
  <div class="promo-codes">
    <div class="promo-codes__inner">
      <h1 class="promo-codes__title">{{ $t("admin.menu.promoCodes") }}</h1>
      <div class="promo-codes__header">
        <app-button
          :text="$t('admin.utils.create')"
          @clickButton="$router.push('/promo-code/create')"
        />
      </div>
      <div class="promo-codes__body">
        <app-table
          :columns="columns"
          :rows="rows"
          :cross="true"
          :edit="true"
          :loading="getItemsLoader"
          @clickEdit="
            ({ item }) => $router.push(`/promo-code/edit?id=${item._id}`)
          "
          @clickCross="openDeleteModal"
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
import AppInformationModal from "@/components/elements/AppInformationModal";
import TableActionsMixin from "@/mixins/TableActionsMixin";
import { mapActions, mapState } from "vuex";

export default {
  name: "PromoCodes",
  components: {
    AppButton,
    AppTable,
    AppInformationModal,
  },
  mixins: [TableActionsMixin],
  computed: {
    ...mapState({
      promoCodes: (state) => state.promoCode.items,
      deleteLoader: (state) => state.promoCode.deleteLoader,
      getItemsLoader: (state) => state.promoCode.getItemsLoader,
    }),
    columns() {
      return [
        {
          title: this.$t("admin.utils.title"),
        },
        {
          title: this.$t("admin.promoCodes.discount"),
        },
        {
          title: this.$t("admin.promoCodes.percent"),
        },
        {
          title: this.$t("admin.utils.categories"),
        },
        {
          title: this.$t("admin.utils.products"),
        },
      ];
    },
    rows() {
      return this.promoCodes.map((promoCode) => {
        const categoriesTitle = promoCode.categories
          .map((category) => this.$t(category.title))
          .join(", ");

        const productsTitles = promoCode.products
          .map((product) => this.$t(product.title))
          .join(", ");
        return {
          item: promoCode,
          cells: [
            {
              title: this.$t(promoCode.code),
            },
            {
              title: promoCode.discount,
            },
            {
              title: this.$t(`admin.utils.${String(promoCode.percent)}`),
            },
            {
              title: categoriesTitle
                ? categoriesTitle
                : this.$t("admin.utils.all"),
            },
            {
              title: productsTitles
                ? productsTitles
                : this.$t("admin.utils.all"),
            },
          ],
        };
      });
    },
  },
  methods: {
    ...mapActions({
      getAllPromoCodes: "promoCode/getAllItems",
      deleteItem: "promoCode/deleteItem",
    }),
    async deleteItemHandler() {
      await this.deleteItem({ id: this.deleteItemId });
      this.getPromoCodesByLimit();
      this.closeModal();
    },
    getPromoCodesByLimit() {
      this.getAllPromoCodes();
    },
  },
  mounted() {
    this.getPromoCodesByLimit();
  },
};
</script>

<style lang="scss" scoped>
.promo-codes {
  &__title {
    font-size: 24px;
  }

  &__header {
    display: flex;
    justify-content: flex-end;
    margin: 10px 0;
  }

  &__body {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>
