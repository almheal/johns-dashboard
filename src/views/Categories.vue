<template>
  <div class="categories">
    <div class="categories__inner">
      <h1 class="categories__title">{{ $t("admin.menu.category") }}</h1>
      <form class="categories__form" @submit.prevent="categoryHandler">
        <img
          class="categories__preview"
          v-if="categoryPreviewImg"
          :src="categoryPreviewImg"
          alt="category-preview"
        />
        <app-upload-file
          class="categories__upload"
          :error="$t(errors.icon)"
          v-model="iconUrl"
          @changeFile="changeIcon"
          @preview="(preview) => (categoryPreviewImg = preview)"
        />
        <app-input
          :placeholder="$t('admin.utils.title')"
          :error="$t(errors.title)"
          v-model="category.title"
          @update:modelValue="errors.title = ''"
        />
        <app-button
          class="categories__button"
          buttonType="submit"
          :text="
            editCategoryId ? $t('admin.utils.edit') : $t('admin.utils.add')
          "
          :loading="loader"
        />
        <app-button
          class="categories__button"
          v-if="editCategoryId"
          :text="$t('admin.utils.cancel')"
          @clickButton="resetCategory"
        />
      </form>
      <div class="categories__body">
        <app-table
          :columns="columns"
          :rows="rows"
          :cross="true"
          :edit="true"
          :loading="getItemsLoader"
          @clickCross="openDeleteModal"
          @clickEdit="editCategoryHandler"
        />
      </div>
    </div>
    <app-information-modal
      v-if="deleteItemId"
      :buttons="buttonsModalDelete"
      :title="$t('admin.confirmDelete.title')"
      :text="`${$t('admin.confirmDelete.text')}?`"
      :close="closeModal"
    />
  </div>
</template>

<script>
import AppInput from "@/components/elements/AppInput";
import AppButton from "@/components/elements/AppButton";
import AppUploadFile from "@/components/elements/AppUploadFile";
import AppTable from "@/components/elements/AppTable";
import AppInformationModal from "@/components/elements/AppInformationModal";
import TableActionsMixin from "@/mixins/TableActionsMixin";
import { requestCreateImage } from "@/services/image.service";
import { ERRORS_MESSAGE_CODES } from "@/consts/errors";
import { mapActions, mapState } from "vuex";

export default {
  name: "Categories",
  components: {
    AppInput,
    AppButton,
    AppUploadFile,
    AppTable,
    AppInformationModal,
  },
  mixins: [TableActionsMixin],
  data: () => ({
    category: {
      title: "",
      icon: "",
    },
    errors: {
      title: "",
      icon: "",
    },
    loader: false,
    iconUrl: "",
    categoryPreviewImg: "",
    editCategoryId: null,
  }),
  computed: {
    ...mapState({
      deleteLoader: (state) => state.category.deleteLoader,
      getItemsLoader: (state) => state.category.getItemsLoader,
      getCategories: (state) => state.category.items,
    }),
    columns() {
      return [
        {
          title: this.$t("admin.utils.title"),
        },
        {
          title: this.$t("admin.utils.icon"),
        },
      ];
    },
    rows() {
      return this.getCategories.map((category) => {
        return {
          item: category,
          cells: [
            {
              title: this.$t(category.title),
            },
            {
              img: category.icon,
            },
          ],
        };
      });
    },
  },
  methods: {
    ...mapActions({
      getAllCategories: "category/getAllItems",
      createCategory: "category/createItem",
      updateCategory: "category/updateItem",
      deleteItem: "category/deleteItem",
    }),
    async categoryHandler() {
      const isValid = this.validate();
      if (!isValid) {
        return;
      }

      this.loader = true;

      try {
        if (typeof this.category.icon === "object") {
          const { data: imgUrl } = await requestCreateImage(this.category.icon);
          this.category.icon = imgUrl;
        }

        if (this.editCategoryId) {
          await this.updateCategory({
            id: this.editCategoryId,
            body: this.category,
          });
        } else {
          await this.createCategory({ body: this.category });
        }

        this.resetCategory();
      } catch (err) {
        console.log(err);
      } finally {
        this.loader = false;
      }
    },
    validate() {
      const errors = {
        title: `errors.${ERRORS_MESSAGE_CODES.CATEGORY_TITLE_EMPTY}`,
        icon: `errors.${ERRORS_MESSAGE_CODES.CATEGORY_ICON_EMPTY}`,
      };

      return Object.keys(errors).reduce((acc, key) => {
        if (!this.category[key]) {
          this.errors[key] = errors[key];
          acc = false;
        }
        return acc;
      }, true);
    },
    async deleteItemHandler() {
      await this.deleteItem({ id: this.deleteItemId });
      this.closeModal();
    },
    editCategoryHandler({ item }) {
      this.category.title = item.title;
      this.category.icon = item.icon;
      this.categoryPreviewImg = item.icon;
      this.editCategoryId = item._id;
    },
    changeIcon(formData) {
      this.category.icon = formData;
      this.errors.icon = "";
    },
    resetCategory() {
      this.category.title = "";
      this.category.icon = "";
      this.editCategoryId = null;
      this.iconUrl = "";
      this.categoryPreviewImg = "";
    },
  },
  mounted() {
    this.getAllCategories();
  },
};
</script>

<style lang="scss" scoped>
.categories {
  &__title {
    font-size: 24px;
  }

  &__form {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
  }

  &__upload {
    margin: 2px 10px 0 0;
  }

  &__button {
    margin: 12px 0 0 10px;
  }

  &__preview {
    width: 40px;
    height: 40px;
    margin: 12px 10px 0 0;
  }
}
</style>
