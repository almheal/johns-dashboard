<template>
  <div class="ingredients">
    <div class="ingredients__inner">
      <h1 class="ingredients__title">{{ $t("app.ingredients.title") }}</h1>
      <div class="ingredients__header">
        <app-button
          :text="$t('admin.utils.create')"
          @click="toIngredient('create')"
        />
      </div>
      <div class="ingredients__body">
        <app-table
          :columns="columns"
          :rows="rows"
          :loading="getItemsLoader"
          :cross="true"
          :edit="true"
          @clickEdit="({ item }) => toIngredient(`edit?id=${item._id}`)"
          @clickCross="openDeleteModal"
        />
        <app-pagination
          class="ingredients__pagination"
          :length="ingredientsAllLength"
          :limit="DEFAULT_LIMIT"
          @changePage="getIngredientsByLimit"
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
import AppTable from "@/components/elements/AppTable";
import AppButton from "@/components/elements/AppButton";
import AppPagination from "@/components/elements/AppPagination";
import AppInformationModal from "@/components/elements/AppInformationModal";
import TableActionsMixin from "@/mixins/TableActionsMixin";
import { calculatePagination } from "@/utils";
import { mapActions, mapState } from "vuex";

export default {
  name: "Ingredients",
  components: {
    AppTable,
    AppButton,
    AppPagination,
    AppInformationModal,
  },
  mixins: [TableActionsMixin],
  data: () => ({
    DEFAULT_LIMIT: 10,
  }),
  computed: {
    ...mapState({
      deleteLoader: (state) => state.ingredient.deleteLoader,
      getItemsLoader: (state) => state.ingredient.getItemsLoader,
      ingredientsAllLength: (state) => state.ingredient.lengthAllItems,
      getIngredients: (state) => state.ingredient.items,
    }),
    columns() {
      return [
        { title: this.$t("admin.utils.title") },
        { title: this.$t("admin.utils.price") },
        { title: this.$t("admin.utils.icon") },
        { title: this.$t("admin.utils.category") },
      ];
    },
    currentPage() {
      return this.$route.query.page;
    },
    rows() {
      return this.getIngredients.map((ingredient) => {
        return {
          item: ingredient,
          cells: [
            {
              title: ingredient.title,
            },
            {
              title: ingredient.price,
            },
            {
              img: ingredient.icon,
            },
            {
              title: ingredient.category,
            },
          ],
        };
      });
    },
  },
  methods: {
    ...mapActions({
      getAllIngredients: "ingredient/getAllItems",
      deleteItem: "ingredient/deleteItem",
    }),
    async getIngredientsByLimit() {
      const { skip, limit } = calculatePagination({
        limit: this.DEFAULT_LIMIT,
        page: this.currentPage,
      });

      this.getAllIngredients({ skip, limit });
    },
    toIngredient(actionName) {
      this.$router.push(`/ingredients/${actionName}`);
    },
  },
  mounted() {
    this.getIngredientsByLimit();
  },
};
</script>

<style lang="scss" scoped>
.ingredients {
  &__inner {
    display: flex;
    flex-direction: column;
    height: 100%;
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

  &__pagination {
    margin: 30px auto 0;
  }
}
</style>
