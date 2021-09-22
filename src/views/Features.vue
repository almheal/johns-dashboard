<template>
  <div class="features">
    <div class="features__inner">
      <h1 class="features__title">{{ $t("app.features.title") }}</h1>
      <form class="features__form" @submit.prevent="featureHandler">
        <img
          class="features__preview"
          :src="featureImgPreview"
          v-if="featureImgPreview"
          alt="feature-preview"
        />
        <app-upload-file
          class="features__upload"
          :error="errors.icon"
          @changeFile="changeIcon"
          @preview="(preview) => (featureImgPreview = preview)"
        />
        <app-input
          :placeholder="$t('admin.utils.title')"
          :error="errors.title"
          v-model="feature.title"
          @update:modelValue="errors.title = ''"
        />
        <app-button
          class="features__button"
          :text="editFeatureId ? 'admin.utils.edit' : 'admin.utils.add'"
          buttonType="submit"
        />
      </form>
      <div class="features__body">
        <app-table
          :columns="columns"
          :rows="rows"
          :cross="true"
          :edit="true"
          :loading="isLoading"
          @clickEdit="editFeatureHandler"
          @clickCross="deleteFeatureHandler"
        />
        <app-pagination
          class="features__pagination"
          @changePage="getFeaturesByLimit"
          :length="featuresAllLength"
        />
      </div>
    </div>
    <app-information-modal
      v-if="deleteFeatureId"
      title="admin.confirmDelete.title"
      :text="`${$t('admin.confirmDelete.text')}?`"
      :buttons="modalButtons"
      :close="closeModal"
    />
  </div>
</template>

<script>
import AppInput from "@/components/elements/AppInput";
import AppButton from "@/components/elements/AppButton";
import AppUploadFile from "@/components/elements/AppUploadFile";
import AppTable from "@/components/elements/AppTable";
import AppPagination from "@/components/elements/AppPagination";
import AppInformationModal from "@/components/elements/AppInformationModal";
import { requestCreateImage } from "@/services/image.service";
import { calculatePagination } from "@/utils";
import { LIMIT_ITEMS } from "@/consts";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Features",
  components: {
    AppInput,
    AppButton,
    AppUploadFile,
    AppTable,
    AppPagination,
    AppInformationModal,
  },
  data: () => ({
    feature: {
      title: "",
      icon: "",
    },
    columns: [{ title: "admin.utils.title" }, { title: "admin.utils.icon" }],
    featureImgPreview: "",
    isLoading: false,
    errors: {
      title: "",
      icon: "",
    },
    deleteFeatureId: null,
    editFeatureId: null,
  }),
  computed: {
    ...mapGetters({
      getFeatures: "feature/getItems",
      getLoader: "feature/getLoader",
      featuresAllLength: "feature/getLength",
    }),
    currentPage() {
      return this.$route.query.page;
    },
    rows() {
      return this.getFeatures.map((feature) => {
        return {
          item: feature,
          cells: [
            {
              title: feature.title,
            },
            {
              img: feature.icon,
            },
          ],
        };
      });
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
          fn: this.deleteFeatureHandler,
        },
      ];
    },
  },
  methods: {
    ...mapActions({
      getAllFeatures: "feature/getAllItems",
      deleteFeature: "feature/deleteItem",
      createFeature: "feature/createItem",
      updateFeature: "feature/updateItem",
    }),
    async featureHandler() {
      if (!this.feature.title) {
        this.errors.title = "errors.21";
      }

      if (!this.feature.icon) {
        this.errors.icon = "errors.22";
      }

      if (!this.feature.title || !this.feature.icon) {
        return;
      }

      if (typeof this.feature.icon === "object") {
        const { data: imgUrl } = await requestCreateImage(this.feature.icon);
        this.feature.icon = imgUrl;
      }

      if (this.editFeatureId) {
        await this.updateFeature({
          id: this.editFeatureId,
          body: this.feature,
        });
        this.editFeatureId = null;
      } else {
        await this.createFeature({ body: this.feature, addNew: false });
      }

      this.resetFeature();
      this.getFeaturesByLimit();
    },
    async deleteFeatureHandler(row) {
      if (!this.deleteFeatureId) {
        this.deleteFeatureId = row.item._id;
        return;
      }

      await this.deleteFeature({ id: this.deleteFeatureId, isDelete: false });
      this.getFeaturesByLimit();
      this.closeModal();
    },
    closeModal() {
      this.deleteFeatureId = null;
    },
    editFeatureHandler({ item }) {
      this.feature.title = item.title;
      this.feature.icon = item.icon;
      this.featureImgPreview = item.icon;
      this.editFeatureId = item._id;
    },
    async getFeaturesByLimit() {
      if (this.getFeatures.length === 1 && this.currentPage > 1) {
        await this.$router.replace({
          query: {
            page: this.currentPage - 1,
          },
        });
      }

      const { skip, limit } = calculatePagination({
        limit: LIMIT_ITEMS,
        page: this.currentPage,
      });

      this.isLoading = true;
      await this.getAllFeatures({ skip, limit });
      this.isLoading = false;
    },
    changeIcon(formData) {
      this.feature.icon = formData;
      this.errors.icon = "";
    },
    resetFeature() {
      this.feature.title = "";
      this.feature.icon = "";
      this.featureImgPreview = "";
    },
  },
  mounted() {
    this.getFeaturesByLimit();
  },
};
</script>

<style lang="scss" scoped>
.features {
  &__inner {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  &__title {
    font-size: 24px;
  }

  &__form {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
  }

  &__body {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__preview {
    width: 40px;
    height: 40px;
    margin: 12px 10px 0 0;
  }

  &__button {
    margin: 12px 0 0 10px;
  }

  &__upload {
    margin: 2px 10px 0 0;
  }

  &__pagination {
    margin: 30px auto 0;
  }
}
</style>
