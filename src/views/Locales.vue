<template>
  <div class="locales">
    <div class="locales__inner">
      <h1 class="locales__title">{{ $t("admin.menu.locales") }}</h1>
      <div class="locales__header">
        <form class="locales__create" @submit.prevent="localeHandler">
          <app-input
            :placeholder="$t('admin.createLocale.localeTitle')"
            v-model="locale.title"
            :error="errors.title"
          />
          <app-button
            class="locales__button"
            :text="!editItemId ? `admin.utils.add` : `admin.utils.edit`"
            :loading="localeLoader"
            buttonType="submit"
          />
          <app-button
            class="locales__button"
            v-if="editItemId"
            text="admin.utils.cancel"
            :loading="localeLoader"
            buttonType="button"
            @clickButton="resetEdit"
          />
        </form>
      </div>
      <app-table
        :columns="columns"
        :rows="rows"
        :isNumeration="true"
        :cross="true"
        :edit="true"
        @clickCross="deleteLocaleHandler"
        @clickEdit="editLocaleHandler"
        @clickOnRow="toLocaleMessages"
      />
    </div>
    <app-information-modal
      v-if="isModal"
      :close="closeModal"
      title="admin.confirmDelete.title"
      :text="`${$t('admin.confirmDelete.text')}?`"
      :buttons="modalButtons"
    />
  </div>
</template>

<script>
import AppTable from "@/components/elements/AppTable";
import AppButton from "@/components/elements/AppButton";
import AppInput from "@/components/elements/AppInput";
import AppInformationModal from "@/components/elements/AppInformationModal";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Locales",
  components: {
    AppTable,
    AppButton,
    AppInput,
    AppInformationModal,
  },
  data: () => ({
    locale: {
      title: "",
    },
    columns: [
      {
        title: "admin.utils.title",
      },
    ],
    errors: {
      title: "",
    },
    isModal: false,
    deleteItem: {},
    editItemId: null,
  }),
  computed: {
    ...mapGetters({
      getLocales: "locale/getItems",
      localeLoader: "locale/getLoader",
    }),
    modalButtons() {
      return [
        {
          text: "admin.utils.cancel",
          fn: this.closeModal,
        },
        {
          text: "admin.utils.confirm",
          loading: this.localeLoader,
          fn: this.deleteLocaleHandler,
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
  watch: {
    "locale.title"() {
      if (this.errors.title) {
        this.errors.title = "";
      }
    },
  },
  methods: {
    ...mapActions({
      deleteLocale: "locale/deleteItem",
      createLocale: "locale/createItem",
      updateLocale: "locale/updateItem",
      createLocaleMessages: "localeMessages/createItem",
    }),
    async deleteLocaleHandler(row = {}) {
      if (!this.isModal) {
        this.deleteItem = row.item;
        this.isModal = true;
        return;
      }

      await this.deleteLocale(this.deleteItem._id);
      this.closeModal();
    },
    editLocaleHandler(row = {}) {
      this.editItemId = row.item._id;
      this.locale.title = row.item.title;
    },
    resetEdit() {
      this.editItemId = null;
      this.locale.title = "";
    },
    closeModal() {
      this.deleteItem = {};
      this.isModal = false;
    },
    async localeHandler() {
      if (!this.locale.title) {
        this.errors.title = "Пуст";
        return;
      }

      if (this.editItemId) {
        const { messageCodes } = await this.updateLocale({
          id: this.editItemId,
          body: this.locale,
        });

        if (!messageCodes) {
          this.locale.title = "";
          this.resetEdit();
        }
        return;
      }

      const { messageCodes } = await this.createLocale(this.locale);

      if (!messageCodes) {
        this.locale.title = "";
      }
    },

    toLocaleMessages({ item }) {
      if (!item.messages) {
        return;
      }

      this.$router.push(`/locale-messages/${item.messages}`);
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

  &__title {
    font-size: 24px;
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
