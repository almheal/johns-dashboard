<template>
  <div class="ingredient">
    <div class="ingredient__inner">
      <h1 class="ingredient__title">
        {{ $t("admin.createSubProduct.newIngredient") }}
      </h1>
      <form class="ingredient__form" @submit.prevent="ingredientActionHandler">
        <app-input
          label="admin.utils.title"
          v-model="ingredient.title"
          :error="errors.title"
          @update:modelValue="resetErrorOnInput('title')"
        />
        <app-input
          label="admin.utils.price"
          v-model="ingredient.price"
          :error="errors.price"
          @update:modelValue="resetErrorOnInput('price')"
        />
        <div class="ingredient__icon">
          <app-upload-file
            label="admin.utils.icon"
            :error="errors.icon"
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
          label="admin.utils.category"
          v-model="ingredient.category"
          :error="errors.category"
          @update:modelValue="resetErrorOnInput('category')"
        />
        <app-button
          class="ingredient__button"
          :text="
            getRouteAction === 'create'
              ? 'admin.utils.create'
              : 'admin.utils.edit'
          "
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
import { mapActions, mapGetters } from "vuex";

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
    previewImgIngredient: "",
    errors: {
      title: "",
      price: "",
      icon: "",
      category: "",
    },
  }),
  computed: {
    ...mapGetters({
      getIngredient: "ingredient/getItem",
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
          const { messageCodes } = await this.createIngredient({
            body: this.ingredient,
            addNew: false,
          });
          if (!messageCodes) {
            this.resetIngredient();
          }
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
      let isValid = true;
      const errors = [
        { property: "title", messageCode: "17" },
        { property: "price", messageCode: "19" },
        { property: "icon", messageCode: "18" },
        { property: "category", messageCode: "20" },
      ];
      errors.forEach(({ property, messageCode }) => {
        if (!this.ingredient[property]) {
          this.errors[property] = `errors.${messageCode}`;
          isValid = false;
        }
      });
      return isValid;
    },
    resetIngredient() {
      this.ingredient = resetObjProperties(this.ingredient);
      this.previewImgIngredient = "";
    },
  },
  async mounted() {
    console.log(this.getRouteAction);
    if (this.getRouteAction !== "create" && this.getRouteAction !== "edit") {
      this.$router.push("/ingredients");
    }

    if (this.getRouteAction === "edit" && !this.getEditId) {
      this.$router.replace({ params: { action: "create" } });
    }

    if (this.getRouteAction === "edit" && this.getEditId) {
      await this.getOneIngredient({
        id: this.getEditId,
        addNew: false,
        setItem: true,
      });
      this.ingredient = JSON.parse(JSON.stringify(this.getIngredient));
      console.log(this.ingredient);
      this.previewImgIngredient = this.ingredient.icon;
    }
  },
};
</script>

<style lang="scss" scoped>
.ingredient {
  &__title {
    font-size: 24px;
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
