<template>
  <div class="ingredient">
    <div class="ingredient__inner">
      <h1 class="ingredient__title">
        {{
          $t(
            getRouteAction === "create"
              ? "admin.newIngredient"
              : "admin.editIngredient"
          )
        }}
      </h1>
      <form class="ingredient__form" @submit.prevent="ingredientActionHandler">
        <app-input
          :label="$t('admin.utils.title')"
          :error="$t(errors.title)"
          v-model="ingredient.title"
          @update:modelValue="resetErrorOnInput('title')"
        />
        <app-input
          :label="$t('admin.utils.price')"
          :error="$t(errors.price)"
          v-model="ingredient.price"
          @update:modelValue="resetErrorOnInput('price')"
        />
        <div class="ingredient__icon">
          <app-upload-file
            :label="$t('admin.utils.icon')"
            :error="$t(errors.icon)"
            v-model="iconUrl"
            @changeFile="changeIcon"
            @preview="(preview) => (previewImgIngredient = preview)"
          />
          <div class="ingredient__preview" v-if="previewImgIngredient">
            <img
              class="ingredient__img"
              :src="previewImgIngredient"
              alt="ingredient"
            />
          </div>
        </div>
        <app-input
          :label="$t('admin.utils.category')"
          :error="$t(errors.category)"
          v-model="ingredient.category"
          @update:modelValue="resetErrorOnInput('category')"
        />
        <app-button
          class="ingredient__button"
          :text="
            getRouteAction === 'create'
              ? $t('admin.utils.create')
              : $t('admin.utils.edit')
          "
          :loading="oneFeatureLoader || createLoader || updateLoader"
          buttonType="submit"
        />
      </form>
    </div>
  </div>
</template>

<script>
import AppInput from "@/components/elements/AppInput";
import AppButton from "@/components/elements/AppButton";
import AppUploadFile from "@/components/elements/AppUploadFile";
import { requestCreateImage } from "@/services/image.service";
import { resetObjProperties } from "@/utils";
import { ERRORS_MESSAGE_CODES } from "@/consts/errors";
import { mapActions, mapState } from "vuex";

export default {
  name: "Ingredient",
  components: {
    AppInput,
    AppButton,
    AppUploadFile,
  },
  data: () => ({
    ingredient: {
      title: "",
      price: "",
      icon: "",
      category: "",
    },
    errors: {
      title: "",
      price: "",
      icon: "",
      category: "",
    },
    iconUrl: "",
    previewImgIngredient: "",
  }),
  computed: {
    ...mapState({
      oneFeatureLoader: (state) => state.ingredient.getItemLoader,
      createLoader: (state) => state.ingredient.createLoader,
      updateLoader: (state) => state.ingredient.updateLoader,
      getIngredient: (state) => state.ingredient.item,
    }),
    getRouteAction() {
      return this.$route.params.action;
    },
    getEditId() {
      return this.$route.query.id;
    },
  },
  methods: {
    ...mapActions({
      createIngredient: "ingredient/createItem",
      updateIngredient: "ingredient/updateItem",
      getOneIngredient: "ingredient/getItem",
    }),
    async ingredientActionHandler() {
      const isValid = this.validate();
      if (!isValid) {
        return;
      }
      try {
        if (typeof this.ingredient.icon === "object") {
          const { data: imgUrl } = await requestCreateImage(
            this.ingredient.icon
          );
          this.ingredient.icon = imgUrl;
        }

        if (this.getRouteAction === "create") {
          await this.createIngredient({
            body: this.ingredient,
            addNew: false,
          });
          this.resetIngredient();
        }

        if (this.getRouteAction === "edit") {
          await this.updateIngredient({
            id: this.getEditId,
            body: this.ingredient,
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    changeIcon(formData) {
      this.ingredient.icon = formData;
      this.errors.icon = "";
    },
    resetErrorOnInput(errorProperty) {
      this.errors[errorProperty] = "";
    },
    validate() {
      const errors = {
        title: `errors.${ERRORS_MESSAGE_CODES.INGREDIENT_TITLE_EMPTY}`,
        price: `errors.${ERRORS_MESSAGE_CODES.INGREDIENT_PRICE_EMPTY}`,
        icon: `errors.${ERRORS_MESSAGE_CODES.INGREDIENT_ICON_EMPTY}`,
        category: `errors.${ERRORS_MESSAGE_CODES.INGREDIENT_CATEGORY_EMPTY}`,
      };

      return Object.keys(errors).reduce((acc, key) => {
        if (!this.ingredient[key]) {
          this.errors[key] = errors[key];
          acc = false;
        }
        return acc;
      }, true);
    },
    resetIngredient() {
      this.ingredient = resetObjProperties(this.ingredient);
      this.previewImgIngredient = "";
      this.iconUrl = "";
    },
  },
  async mounted() {
    if (this.getRouteAction !== "create" && this.getRouteAction !== "edit") {
      this.$router.push("/ingredients");
    }

    if (this.getRouteAction === "edit" && !this.getEditId) {
      this.$router.replace({ params: { action: "create" } });
    }

    if (this.getRouteAction === "edit" && this.getEditId) {
      this.isLoading = true;
      await this.getOneIngredient({
        id: this.getEditId,
        addNew: false,
        setItem: true,
      });
      this.ingredient = JSON.parse(JSON.stringify(this.getIngredient));
      this.previewImgIngredient = this.ingredient.icon;
      this.isLoading = false;
    }
  },
};
</script>

<style lang="scss" scoped>
.ingredient {
  &__title {
    margin-bottom: 10px;
  }

  &__form {
    max-width: 400px;
  }

  &__icon {
    display: flex;
    align-items: center;
  }

  &__preview {
    width: 50%;
    height: 65px;
    margin-left: 15px;
  }

  &__img {
    height: 100%;
  }

  &__button {
    margin-top: 15px;
  }
}
</style>
