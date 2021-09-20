<template>
  <div class="tags">
    <div class="tags__inner">
      <h1 class="tags__title">{{ $t("app.tags.title") }}</h1>
      <div class="tags__actions">
        <form class="tags__form" @submit.prevent="tagHandler">
          <app-input
            class="tags__input"
            :placeholder="$t('admin.utils.title')"
            :error="errors.title"
            v-model="tag.title"
            data-test="form"
          />
          <app-input
            class="tags__input"
            :placeholder="$t('admin.utils.backgroundColor')"
            :error="errors.backgroundColor"
            v-model="tag.backgroundColor"
          />
          <app-button
            class="tags__button"
            v-if="!editItemId"
            text="admin.utils.add"
            :loading="getLoader"
            buttonType="submit"
            data-test-button="create"
          />
          <template v-else>
            <app-button
              class="tags__button tags__button_margin-right"
              text="admin.utils.edit"
              :loading="getLoader"
              buttonType="submit"
            />
            <app-button
              class="tags__button"
              text="admin.utils.cancel"
              :loading="getLoader"
              @clickButton="resetTag"
            />
          </template>
        </form>
      </div>
      <div class="tags__body">
        <app-table
          :columns="columns"
          :rows="rows"
          :cross="true"
          :edit="true"
          :loading="isLoading"
          @clickCross="deleteTagHandler"
          @clickEdit="editTagHandler"
        />
        <app-pagination
          class="tags__pagination"
          :length="tagsLength"
          @changePage="getTagsByLimit"
        />
      </div>
    </div>
    <app-information-modal
      v-if="deleteItemId"
      title="admin.confirmDelete.title"
      :text="`${$t('admin.confirmDelete.text')}?`"
      :buttons="modalButtons"
      :close="closeModal"
    />
  </div>
</template>

<script>
import AppTable from "@/components/elements/AppTable";
import AppInput from "@/components/elements/AppInput";
import AppButton from "@/components/elements/AppButton";
import AppInformationModal from "@/components/elements/AppInformationModal";
import AppPagination from "@/components/elements/AppPagination";
import { calculatePagination } from "@/utils";
import { LIMIT_ITEMS } from "@/consts";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Tags",
  components: {
    AppTable,
    AppInput,
    AppButton,
    AppInformationModal,
    AppPagination,
  },
  data: () => ({
    tag: {
      title: "",
      backgroundColor: "",
    },
    columns: [
      { title: "admin.utils.title" },
      { title: "admin.utils.backgroundColor" },
    ],
    errors: {
      title: "",
      backgroundColor: "",
    },
    deleteItemId: "",
    editItemId: "",
    isLoading: false,
  }),
  computed: {
    ...mapGetters({
      getTags: "tag/getItems",
      tagsLength: "tag/getLength",
      getLoader: "tag/getLoader",
    }),
    rows() {
      return this.getTags.map((tag) => {
        return {
          item: tag,
          cells: [
            {
              title: tag.title,
            },
            {
              title: tag.backgroundColor,
              color: tag.backgroundColor,
            },
          ],
        };
      });
    },
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
          fn: this.deleteTagHandler,
        },
      ];
    },
  },
  watch: {
    "tag.title"() {
      if (this.errors.title) {
        this.errors.title = "";
      }
    },
    "tag.backgroundColor"() {
      if (this.errors.backgroundColor) {
        this.errors.backgroundColor = "";
      }
    },
  },
  methods: {
    ...mapActions({
      createTag: "tag/createItem",
      deleteTag: "tag/deleteItem",
      updateTag: "tag/updateItem",
      getAllTags: "tag/getAllItems",
    }),
    closeModal() {
      this.deleteItemId = false;
    },
    async tagHandler() {
      if (!this.tag.title) {
        this.errors.title = "admin.errors.tag.titleEmpty";
      }
      if (!this.tag.backgroundColor) {
        this.errors.backgroundColor = "admin.errors.tag.backgroundColorEmpty";
      }

      if (!this.tag.title || !this.tag.backgroundColor) {
        return;
      }

      if (this.editItemId) {
        const { messageCodes } = await this.updateTag({
          id: this.editItemId,
          body: this.tag,
        });

        if (!messageCodes) {
          this.resetTag();
        }
        return;
      }

      const { messageCodes } = await this.createTag({
        body: this.tag,
        addNew: false,
      });

      if (!messageCodes) {
        this.resetTag();
      }
      this.getTagsByLimit();
    },
    async deleteTagHandler(row) {
      if (!this.deleteItemId) {
        this.deleteItemId = row.item._id;
        return;
      }

      const { messageCodes } = await this.deleteTag({
        id: this.deleteItemId,
        isDelete: false,
      });

      if (!messageCodes) {
        if (this.getTags.length === 1 && this.currentPage > 1) {
          await this.$router.replace({
            query: {
              page: this.currentPage - 1,
            },
          });
        }
        this.getTagsByLimit();
      }
      this.closeModal();
    },
    editTagHandler({ item }) {
      this.editItemId = item._id;
      this.tag.title = item.title;
      this.tag.backgroundColor = item.backgroundColor;
    },
    resetTag() {
      this.editItemId = "";
      this.tag.title = "";
      this.tag.backgroundColor = "";
    },
    async getTagsByLimit() {
      const { skip, limit } = calculatePagination({
        limit: LIMIT_ITEMS,
        page: this.currentPage,
      });

      this.isLoading = true;
      await this.getAllTags({ skip, limit });
      this.isLoading = false;
    },
  },
  mounted() {
    this.getTagsByLimit();
  },
};
</script>

<style lang="scss" scoped>
.tags {
  &__title {
    font-size: 24px;
  }

  &__inner {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &__body {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__form {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
  }

  &__input {
    margin-right: 10px;
  }

  &__pagination {
    justify-content: center;
    margin-top: 15px;
  }

  &__button {
    margin-top: 12px;

    &_margin-right {
      margin-right: 10px;
    }
  }
}
</style>
