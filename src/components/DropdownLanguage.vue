<template>
  <div class="language">
    <app-dropdown
      :items="getLocales"
      :toShow="(item) => item.title"
      :selectedItem="getCurrentLocale"
      @selectItem="selectLanguageHandler"
    />
  </div>
</template>

<script>
import AppDropdown from "@/components/elements/AppDropdown";
import LanguageMixin from "@/mixins/LanguageMixin";
import { mapGetters } from "vuex";

export default {
  name: "DropdownLanguage",
  mixins: [LanguageMixin],
  components: {
    AppDropdown,
  },
  computed: {
    ...mapGetters({
      getLocales: "locale/getItems",
      getCurrentLocale: "locale/getItem",
    }),
  },
  methods: {
    selectLanguageHandler(locale) {
      this.setLocale(locale.title);
    },
  },
};
</script>

<style lang="scss" scoped>
.language {
  text-transform: capitalize;
}
</style>
