<template>
  <div class="app-dropdown" :class="{ 'full-width': fullWidth }">
    <div class="app-dropdown__placeholder" @click="toggleDropdown">
      {{ toShow(selectedItem) || placeholder }}
      <app-arrow-right-icon class="app-dropdown__icon" />
      <ul class="app-dropdown__list" :class="{ show: isShow }">
        <li
          class="app-dropdown__item"
          v-for="(item, index) in itemsList"
          :key="index"
          @click.stop="selectItem(item)"
        >
          {{ toShow(item) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import AppArrowRightIcon from "@/components/icons/AppArrowRightIcon";

export default {
  name: "AppDropdown",
  emits: ["selectItem"],
  components: {
    AppArrowRightIcon,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: "",
    },
    selectedItem: {
      type: String,
      default: "",
    },
    toShow: {
      type: Function,
      default: () => {},
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    multiSelect: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isShow: false,
  }),
  computed: {
    itemsList() {
      return this.items.filter(
        (item) => this.toShow(item) !== this.toShow(this.selectedItem)
      );
    },
  },
  methods: {
    toggleDropdown() {
      if (!this.itemsList.length) {
        return;
      }
      this.isShow = !this.isShow;
    },
    selectItem(item) {
      this.toggleDropdown();
      this.$emit("selectItem", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.app-dropdown {
  display: flex;
  font-size: 16px;

  &.full-width {
    .app-dropdown__placeholder {
      width: 100%;
    }
  }

  &__placeholder {
    position: relative;
    display: flex;
    align-items: center;
    padding: 9px 25px 9px 9px;
    background-color: #fff;
    border: 1px solid rgb(156, 163, 175);
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      .app-dropdown__icon {
        fill: #6b7280;
      }
    }
  }

  &__icon {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%) rotate(90deg);
    width: 12px;
    height: 12px;
    transition: fill 0.2s;
  }

  &__list {
    position: absolute;
    border-radius: 4px;
    left: -1px;
    top: calc(100% + 5px);
    opacity: 0;
    z-index: 50;
    visibility: hidden;
    width: calc(100% + 2px);
    border: 1px solid rgb(156, 163, 175);
    background-color: #fff;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
    transition: 0.2s;

    &.show {
      visibility: visible;
      opacity: 1;
      transition: 0.2s;
    }
  }

  &__item {
    padding: 9px;
    border-bottom: 1px solid rgb(156, 163, 175);
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #e5e7eb;
    }

    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
