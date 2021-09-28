<script>
export default {
  name: "TableActionsMixin",
  data: () => ({
    deleteItemId: null,
  }),
  computed: {
    buttonsModalDelete() {
      return [
        {
          text: `${this.$t("admin.utils.cancel")}`,
          fn: this.closeModal,
        },
        {
          text: `${this.$t("admin.utils.confirm")}`,
          loading: this.deleteLoader,
          fn: this.deleteItemHandler,
        },
      ];
    },
  },
  methods: {
    closeModal() {
      this.deleteItemId = null;
    },
    openDeleteModal(row) {
      this.deleteItemId = row.item._id;
    },
  },
};
</script>
