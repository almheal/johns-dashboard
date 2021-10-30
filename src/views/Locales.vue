<template>
  <div class="locales">
    <div class="locales__inner">
      <h1 class="locales__title">{{ $t("admin.menu.locales") }}</h1>
      <div class="locales__header">
        <form class="locales__create" @submit.prevent="localeHandler">
          <app-input
            :placeholder="$t('admin.createLocale.localeTitle')"
            :error="$t(errors.title)"
            v-model="locale.title"
            @update:modelValue="errors.title = ''"
          />
          <app-button
            class="locales__button"
            :text="!editItemId ? $t('admin.utils.add') : $t('admin.utils.edit')"
            :loading="createLoader || updateLoader"
            buttonType="submit"
          />
          <app-button
            class="locales__button"
            v-if="editItemId"
            :text="$t('admin.utils.cancel')"
            buttonType="button"
            @clickButton="resetLocale"
          />
        </form>
      </div>
      <app-table
        :columns="columns"
        :rows="rows"
        :isNumeration="true"
        :cross="true"
        :edit="true"
        @clickCross="openDeleteModal"
        @clickEdit="editLocaleHandler"
        @clickOnRow="toLocaleMessages"
      />
    </div>
    <app-information-modal
      v-if="deleteItemId"
      :title="$t('admin.confirmDelete.title')"
      :close="closeModal"
      :text="`${$t('admin.confirmDelete.text')}?`"
      :buttons="buttonsModalDelete"
    />
  </div>
</template>

<script>
import AppTable from "@/components/elements/AppTable";
import AppButton from "@/components/elements/AppButton";
import AppInput from "@/components/elements/AppInput";
import AppInformationModal from "@/components/elements/AppInformationModal";
import TableActionsMixin from "@/mixins/TableActionsMixin";
import { ERRORS_MESSAGE_CODES } from "@/consts/errors";
import { mapActions, mapState } from "vuex";

export default {
  name: "Locales",
  components: {
    AppTable,
    AppButton,
    AppInput,
    AppInformationModal,
  },
  mixins: [TableActionsMixin],
  data: () => ({
    locale: {
      title: "",
    },
    errors: {
      title: "",
    },
    editItemId: null,
  }),
  computed: {
    ...mapState({
      createLoader: (state) => state.locale.createLoader,
      updateLoader: (state) => state.locale.updateLoader,
      deleteLoader: (state) => state.locale.deleteLoader,
      getLocales: (state) => state.locale.items,
    }),
    columns() {
      return [
        {
          title: this.$t("admin.utils.title"),
        },
      ];
    },
    rows() {
      return this.getLocales.map((locale) => {
        return {
          hover: true,
          clickable: true,
          item: locale,
          cells: [
            {
              title: locale.title,
            },
          ],
        };
      });
    },
  },
  methods: {
    ...mapActions({
      deleteItem: "locale/deleteItem",
      createLocale: "locale/createItem",
      updateLocale: "locale/updateItem",
      createLocaleMessages: "localeMessages/createItem",
    }),
    async deleteItemHandler() {
      await this.deleteItem({ id: this.deleteItemId });
      this.closeModal();
    },
    editLocaleHandler(row = {}) {
      this.editItemId = row.item._id;
      this.locale.title = row.item.title;
    },
    resetLocale() {
      this.editItemId = null;
      this.locale.title = "";
    },
    async localeHandler() {
      const isValid = this.validate();
      if (!isValid) {
        return;
      }

      if (this.editItemId) {
        await this.updateLocale({
          id: this.editItemId,
          body: this.locale,
        });
      } else {
        await this.createLocale({ body: this.locale });
      }

      this.resetLocale();
    },

    validate() {
      const errors = {
        title: `errors.${ERRORS_MESSAGE_CODES.LOCALE_TITLE_EMPTY}`,
      };
      return Object.keys(errors).reduce((acc, key) => {
        if (!this.locale[key]) {
          this.errors[key] = errors[key];
          acc = false;
        }
        return acc;
      }, true);
    },
    toLocaleMessages({ item }) {
      if (!item.messages) {
        return;
      }

      this.$router.push(`/locale-messages/${item.messages._id}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.locales {
  &__header {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
  }

  &__create {
    display: flex;
    align-items: flex-start;
    margin-left: 10px;
  }

  &__button {
    margin: 11px 0 0 10px;
  }
}
</style>
