<template>
  <div class="tags">
    <div class="tags__inner">
      <h1 class="tags__title">{{ $t("app.tags.title") }}</h1>
      <div class="tags__actions">
        <form class="tags__form" @submit.prevent="tagHandler">
          <app-input
            class="tags__input"
            :placeholder="$t('admin.utils.title')"
            :error="$t(errors.title)"
            data-test="form"
            v-model="tag.title"
            @update:modelValue="errors.title = ''"
          />
          <app-input
            class="tags__input"
            :placeholder="$t('admin.utils.backgroundColor')"
            :error="$t(errors.backgroundColor)"
            v-model="tag.backgroundColor"
            @update:modelValue="errors.backgroundColor = ''"
          />
          <app-button
            class="tags__button"
            :text="!editItemId ? $t('admin.utils.add') : $t('admin.utils.edit')"
            :loading="createLoader || updateLoader"
            buttonType="submit"
            data-test-button="create"
          />

          <app-button
            v-if="editItemId"
            class="tags__button tags__button_margin-left"
            :text="$t('admin.utils.cancel')"
            :loading="getLoader"
            @clickButton="resetTag"
          />
        </form>
      </div>
      <div class="tags__body">
        <app-table
          :columns="columns"
          :rows="rows"
          :cross="true"
          :edit="true"
          :loading="getItemsLoader"
          @clickCross="openDeleteModal"
          @clickEdit="editTagHandler"
        />
        <app-pagination
          class="tags__pagination"
          :length="tagsAllLength"
          :limit="DEFAULT_LIMIT"
          @changePage="getTagsByLimit"
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
import AppInput from "@/components/elements/AppInput";
import AppButton from "@/components/elements/AppButton";
import AppInformationModal from "@/components/elements/AppInformationModal";
import AppPagination from "@/components/elements/AppPagination";
import TableActionsMixin from "@/mixins/TableActionsMixin";
import { calculatePagination } from "@/utils";
import { ERRORS_MESSAGE_CODES } from "@/consts/errors";
import { mapActions, mapState } from "vuex";

export default {
  name: "Tags",
  components: {
    AppTable,
    AppInput,
    AppButton,
    AppInformationModal,
    AppPagination,
  },
  mixins: [TableActionsMixin],
  data: () => ({
    tag: {
      title: "",
      backgroundColor: "",
    },
    errors: {
      title: "",
      backgroundColor: "",
    },
    DEFAULT_LIMIT: 15,
    editItemId: "",
  }),
  computed: {
    ...mapState({
      getItemsLoader: (state) => state.tag.getItemsLoader,
      createLoader: (state) => state.tag.createLoader,
      updateLoader: (state) => state.tag.updateLoader,
      deleteLoader: (state) => state.tag.deleteLoader,
      getTags: (state) => state.tag.items,
      tagsAllLength: (state) => state.tag.lengthAllItems,
    }),
    tagsByLimit() {
      return this.getTags.slice(0, this.DEFAULT_LIMIT);
    },
    columns() {
      return [
        { title: this.$t("admin.utils.title") },
        { title: this.$t("admin.utils.backgroundColor") },
      ];
    },
    rows() {
      return this.tagsByLimit.map((tag) => {
        return {
          item: tag,
          cells: [
            {
              title: this.$t(tag.title),
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
  },
  methods: {
    ...mapActions({
      createTag: "tag/createItem",
      deleteItem: "tag/deleteItem",
      updateTag: "tag/updateItem",
      getAllTags: "tag/getAllItems",
    }),
    async tagHandler() {
      const isValid = this.validate();
      if (!isValid) {
        return;
      }

      if (this.editItemId) {
        await this.updateTag({
          id: this.editItemId,
          body: this.tag,
        });
      } else {
        await this.createTag({
          body: this.tag,
        });
      }

      this.resetTag();
    },
    validate() {
      const errors = {
        title: `errors.${ERRORS_MESSAGE_CODES.TAG_TITLE_EMPTY}`,
        backgroundColor: `errors.${ERRORS_MESSAGE_CODES.TAG_BACKGOUND_COLOR_EMPTY}`,
      };

      return Object.keys(errors).reduce((acc, key) => {
        if (!this.tag[key]) {
          this.errors[key] = errors[key];
          acc = false;
        }
        return acc;
      }, true);
    },
    async deleteItemHandler() {
      await this.deleteItem({ id: this.deleteItemId });
      this.getTagsByLimit();
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
    getTagsByLimit() {
      const { skip, limit } = calculatePagination({
        limit: this.DEFAULT_LIMIT,
        page: this.currentPage,
      });

      this.getAllTags({ skip, limit });
    },
  },
  mounted() {
    this.getTagsByLimit();
  },
};
</script>

<style lang="scss" scoped>
.tags {
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

    &_margin-left {
      margin-left: 10px;
    }
  }
}
</style>
