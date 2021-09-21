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
        />
        <app-pagination
          class="ingredients__pagination"
          :length="allIngredientsLength"
          @changePage="getIngredientsByLimit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AppTable from "@/components/elements/AppTable";
import AppButton from "@/components/elements/AppButton";
import AppPagination from "@/components/elements/AppPagination";
import { calculatePagination } from "@/utils";
import { LIMIT_ITEMS } from "@/consts";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Ingredients",
  components: {
    AppTable,
    AppButton,
    AppPagination,
  },
  data: () => ({
    columns: [
      { title: "admin.utils.title" },
      { title: "admin.utils.price" },
      // { title: "admin.utils.icon" },
      { title: "admin.utils.category" },
    ],
    isLoading: false,
  }),
  computed: {
    ...mapGetters({
      allIngredientsLength: "ingredient/getLength",
      getIngredients: "ingredient/getItems",
    }),
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
    margin: 0 auto;
  }
}
</style>
