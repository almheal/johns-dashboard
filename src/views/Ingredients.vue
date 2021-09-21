<template>
  <div class="ingredients">
    <div class="ingredients__inner">
      <h1 class="ingredients__title">{{ $t("app.ingredients.title") }}</h1>
      <div class="ingredients__header">
        <app-button text="admin.utils.create" @click="toIngredient('create')" />
      </div>
      <div class="ingredients__body">
        <app-table
          :columns="columns"
          :loading="isLoading"
          :rows="rows"
          :cross="true"
          :edit="true"
          @clickEdit="({ item }) => toIngredient(`edit?id=${item._id}`)"
          @clickCross="deleteIngredientHandler"
        />
        <app-pagination
          class="ingredients__pagination"
          :length="allIngredientsLength"
          @changePage="getIngredientsByLimit"
        />
      </div>
    </div>
    <app-information-modal
      v-if="deleteIngredientId"
      title="admin.confirmDelete.title"
      :text="`${$t('admin.confirmDelete.text')}?`"
      :buttons="modalButtons"
      :close="closeModal"
    />
  </div>
</template>

<script>
import AppTable from "@/components/elements/AppTable";
import AppButton from "@/components/elements/AppButton";
import AppPagination from "@/components/elements/AppPagination";
import AppInformationModal from "@/components/elements/AppInformationModal";
import { calculatePagination } from "@/utils";
import { LIMIT_ITEMS } from "@/consts";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Ingredients",
  components: {
    AppTable,
    AppButton,
    AppPagination,
    AppInformationModal,
  },
  data: () => ({
    columns: [
      { title: "admin.utils.title" },
      { title: "admin.utils.price" },
      { title: "admin.utils.icon" },
      { title: "admin.utils.category" },
    ],
    isLoading: false,
    deleteIngredientId: null,
  }),
  computed: {
    ...mapGetters({
      allIngredientsLength: "ingredient/getLength",
      getIngredients: "ingredient/getItems",
      getLoader: "ingredient/getLoader",
    }),
    currentPage() {
      return this.$route.query.page;
    },
    modalButtons() {
      return [
        {
          text: "admin.utils.cancel",
          fn: this.closeModal,
        },
        {
          text: "admin.utils.confirm",
          loading: this.getLoader,
          fn: this.deleteIngredientHandler,
        },
      ];
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
      deleteIngredient: "ingredient/deleteItem",
    }),
    async getIngredientsByLimit() {
      const { skip, limit } = calculatePagination({
        limit: LIMIT_ITEMS,
        page: this.currentPage,
      });

      this.isLoading = true;
      await this.getAllIngredients({ skip, limit });
      this.isLoading = false;
    },
    async deleteIngredientHandler(row) {
      if (!this.deleteIngredientId) {
        this.deleteIngredientId = row.item._id;
        return;
      }

      const { messageCodes } = await this.deleteIngredient({
        id: this.deleteIngredientId,
        isDelete: false,
      });

      if (this.getIngredients.length === 1 && this.currentPage > 1) {
        await this.$router.replace({
          query: {
            page: this.currentPage - 1,
          },
        });
      }

      if (!messageCodes) {
        this.getIngredientsByLimit();
      }
      this.closeModal();
    },
    toIngredient(actionName) {
      this.$router.push(`/ingredients/${actionName}`);
    },
    closeModal() {
      this.deleteIngredientId = null;
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

  &__pagination {
    margin: 30px auto 0;
  }
}
</style>
