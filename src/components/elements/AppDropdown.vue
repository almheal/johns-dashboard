<template>
  <div class="app-dropdown">
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
    opacity: 0;
    top: calc(100% + 5px);
    visibility: hidden;
    width: calc(100% + 2px);
    border: 1px solid rgb(156, 163, 175);
    background-color: #fff;
    transition: 0.2s;

    &.show {
      visibility: visible;
      opacity: 1;
      z-index: 50;
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
