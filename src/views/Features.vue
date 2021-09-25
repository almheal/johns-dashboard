<template>
  <div class="features">
    <div class="features__inner">
      <h1 class="features__title">{{ $t("app.features.title") }}</h1>
      <form class="features__form" @submit.prevent="featureHandler">
        <img
          class="features__preview"
          v-if="featureImgPreview"
          :src="featureImgPreview"
          alt="feature-preview"
        />
        <app-upload-file
          class="features__upload"
          :error="$t(errors.icon)"
          v-model="iconUrl"
          @changeFile="changeIcon"
          @preview="(preview) => (featureImgPreview = preview)"
        />
        <app-input
          :placeholder="$t('admin.utils.title')"
          :error="$t(errors.title)"
          v-model="feature.title"
          @update:modelValue="errors.title = ''"
        />
        <app-button
          class="features__button"
          :text="
            editFeatureId
              ? `${$t('admin.utils.edit')}`
              : `${$t('admin.utils.add')}`
          "
          :loading="createLoader || updateLoader"
          buttonType="submit"
        />
        <app-button
          class="features__button"
          v-if="editFeatureId"
          :text="$t('admin.utils.cancel')"
          @clickButton="resetFeature"
        />
      </form>
      <div class="features__body">
        <app-table
          :columns="columns"
          :rows="rows"
          :cross="true"
          :edit="true"
          :loading="getItemsLoader"
          @clickEdit="editFeatureHandler"
          @clickCross="openDeleteModal"
        />
        <app-pagination
          class="features__pagination"
          :length="featuresAllLength"
          :limit="DEFAULT_LIMIT"
          @changePage="getFeaturesByLimit"
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
import AppPagination from "@/components/elements/AppPagination";
import AppInformationModal from "@/components/elements/AppInformationModal";
import { requestCreateImage } from "@/services/image.service";
import { calculatePagination, resetObjProperties } from "@/utils";
import { LIMIT_ITEMS } from "@/consts";
import { ERRORS_MESSAGE_CODES } from "@/consts/errors";
import { mapActions, mapState } from "vuex";
import TableActionsMixin from "@/mixins/TableActionsMixin";

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
  mixins: [TableActionsMixin],
  data: () => ({
    feature: {
      title: "",
      icon: "",
    },
    iconUrl: "",
    errors: {
      title: "",
      icon: "",
    },
    DEFAULT_LIMIT: 10,
    uploadFileIsClear: false,
    featureImgPreview: "",
    editFeatureId: null,
  }),
  computed: {
    ...mapState({
      createLoader: (state) => state.feature.createLoader,
      deleteLoader: (state) => state.feature.deleteLoader,
      updateLoader: (state) => state.feature.updateLoader,
      getItemsLoader: (state) => state.feature.getItemsLoader,
      featuresAllLength: (state) => state.feature.lengthAllItems,
      getFeatures: (state) => state.feature.items,
    }),
    currentPage() {
      return this.$route.query.page;
    },
    featuresByLimit() {
      return this.getFeatures.slice(0, LIMIT_ITEMS);
    },
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
      return this.getFeatures.map((feature) => {
        return {
          item: feature,
          cells: [
            {
              title: this.$t(feature.title),
            },
            {
              img: feature.icon,
            },
          ],
        };
      });
    },
  },
  methods: {
    ...mapActions({
      getAllFeatures: "feature/getAllItems",
      deleteItem: "feature/deleteItem",
      createFeature: "feature/createItem",
      updateFeature: "feature/updateItem",
    }),
    async featureHandler() {
      const isValid = this.validate();
      if (!isValid) {
        return;
      }

      try {
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
          await this.createFeature({ body: this.feature });
        }

        this.resetFeature();
      } catch (err) {
        console.log(err);
      }
    },
    validate() {
      const validateItems = {
        title: ERRORS_MESSAGE_CODES.FEATURE_TITLE_EMPTY,
        icon: ERRORS_MESSAGE_CODES.FEATURE_ICON_EMPTY,
      };
      return Object.keys(validateItems).reduce((acc, key) => {
        if (!this.feature[key]) {
          acc = false;
          this.errors[key] = `errors.${validateItems[key]}`;
        }
        return acc;
      }, true);
    },
    editFeatureHandler({ item }) {
      this.feature.title = item.title;
      this.feature.icon = item.icon;
      this.featureImgPreview = item.icon;
      this.editFeatureId = item._id;
    },
    getFeaturesByLimit() {
      const { skip, limit } = calculatePagination({
        limit: this.DEFAULT_LIMIT,
        page: this.currentPage,
      });

      this.getAllFeatures({ skip, limit });
    },
    changeIcon(formData) {
      this.feature.icon = formData;
      this.errors.icon = "";
    },
    resetFeature() {
      this.feature = resetObjProperties(this.feature);
      this.featureImgPreview = "";
      this.iconUrl = "";
      this.editFeatureId = null;
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
