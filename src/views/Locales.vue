<template>
  <div class="locales">
    <div class="locales__inner">
      <app-table :columns="columns" :rows="rows" :isNumeration="true" />
    </div>
  </div>
</template>

<script>
import AppTable from "@/components/elements/AppTable";
import { mapGetters } from "vuex";

export default {
  name: "Locales",
  components: {
    AppTable,
  },
  data: () => ({
    columns: [
      {
        title: "Название",
      },
    ],
  }),
  computed: {
    ...mapGetters({
      getLocales: "locale/getItems",
    }),
    rows() {
      return this.getLocales.map((locale) => {
        return {
          hover: true,
          clickable: true,
          cells: [
            {
              title: locale.title,
            },
          ],
        };
      });
    },
  },
  mounted() {
    console.log(this.getLocales);
  },
};
</script>
