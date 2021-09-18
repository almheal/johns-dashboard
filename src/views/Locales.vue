<template>
  <div class="locales">
    <div class="locales__inner">
      <div class="locales__actions">
        <form class="locales__create" @submit.prevent="createLocaleHandler">
          <app-input
            placeholder="Название локали"
            v-model="locale.title"
            :error="errors.title"
          />
          <app-button
            class="locales__button"
            text="Добавить"
            :loading="localeLoader"
            buttonType="submit"
          />
        </form>
      </div>
      <app-table
        :columns="columns"
        :rows="rows"
        :isNumeration="true"
        :cross="true"
        @clickCross="deleteLocaleHandler"
        @clickOnRow="toLocaleMessages"
      />
    </div>
    <app-information-modal
      v-if="isModal"
      :close="closeModal"
      title="Подтверждение удаления"
      text="Вы действительно хотите удалить?"
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
        title: "Название",
      },
    ],
    errors: {
      title: "",
    },
    isModal: false,
    deleteItem: {},
  }),
  computed: {
    ...mapGetters({
      getLocales: "locale/getItems",
      localeLoader: "locale/getLoader",
    }),
    modalButtons() {
      return [
        {
          text: "Отмена",
          fn: this.closeModal,
        },
        {
          text: "Подтвердить",
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
    closeModal() {
      this.deleteItem = {};
      this.isModal = false;
    },
    async createLocaleHandler() {
      if (!this.locale.title) {
        this.errors.title = "Пуст";
        return;
      }
      await this.createLocale(this.locale);
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
  &__actions {
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
