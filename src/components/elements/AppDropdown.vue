<template>
  <div class="app-dropdown" :class="{ 'full-width': fullWidth, error: error }">
    <div class="app-dropdown__placeholder" @click="toggleDropdown">
      {{
        multiSelect
          ? selectedItems || placeholder
          : toShow(selectedItem) || placeholder
      }}
      <app-arrow-right-icon class="app-dropdown__icon" />
      <ul class="app-dropdown__list" :class="{ show: isShow }">
        <li
          class="app-dropdown__item"
          v-for="(item, index) in itemsList"
          :key="index"
          :class="{
            'app-dropdown__item_multi-is-active':
              multiSelectShowingItems.includes(toShow(item)),
          }"
          @click.stop="selectItem(item)"
        >
          {{ toShow(item) }}
        </li>
      </ul>
    </div>
    <div class="app-dropdown__error" v-if="error">{{ error }}</div>
  </div>
</template>

<script>
import AppArrowRightIcon from "@/components/icons/AppArrowRightIcon";
import {
  setDynamicItemLocalStorage,
  getDynamicPropertyLocalStorage,
} from "@/utils";

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
      type: Object,
      default: () => {},
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
    multiSelectedItems: {
      type: Array,
      default: () => [],
    },
    saveKey: {
      type: String,
      default: "",
    },
    saveProperty: {
      type: String,
      default: "",
    },
    isSaved: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: "",
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
    selectedItems() {
      if (!this.multiSelect) {
        return null;
      }

      return this.multiSelectedItems.slice(0, 5).reduce((acc, item, index) => {
        acc += !index ? this.toShow(item) : `, ${this.toShow(item)}`;
        return acc;
      }, "");
    },
    multiSelectShowingItems() {
      return this.multiSelectedItems.map((item) => this.toShow(item));
    },
  },
  watch: {
    selectedItem(value) {
      this.setSaveItems(value);
    },
    multiSelectedItems(value) {
      this.setSaveItems(value);
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
      if (this.multiSelect) {
        this.multiSelectHandler(item);
        return;
      }
      this.toggleDropdown();
      this.$emit("selectItem", item);
      if (this.saveKey && this.saveProperty && this.isSaved) {
        setDynamicItemLocalStorage({
          key: this.saveKey,
          property: this.saveProperty,
          data: item,
        });
      }
    },
    setSaveItems(value) {
      if (this.saveKey && this.saveProperty && this.isSaved) {
        setDynamicItemLocalStorage({
          key: this.saveKey,
          property: this.saveProperty,
          data: value,
        });
      }
    },
    multiSelectHandler(selectedItem) {
      let emittedArray = null;
      const isInArray = this.multiSelectedItems.some(
        (item) => this.toShow(item) === this.toShow(selectedItem)
      );
      if (!isInArray) {
        emittedArray = [...this.multiSelectedItems, selectedItem];
      } else {
        emittedArray = this.multiSelectedItems.filter(
          (item) => this.toShow(item) !== this.toShow(selectedItem)
        );
      }

      this.$emit("selectItem", emittedArray);
      this.setSaveItems(emittedArray);
    },
  },
  mounted() {
    if (this.saveKey && this.saveProperty && this.isSaved) {
      const value = getDynamicPropertyLocalStorage({
        key: this.saveKey,
        property: this.saveProperty,
        defaultValue: this.multiSelect ? [] : "",
      });
      this.$emit("selectItem", value);
    }
  },
};
</script>

<style lang="scss" scoped>
.app-dropdown {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 16px;

  &.error {
    .app-dropdown__placeholder {
      box-shadow: 0px 0px 0px 2px rgba(#c21313, 0.4);
    }
  }

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
    max-height: 250px;
    overflow: auto;
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

    &_multi-is-active {
      background-color: #e5e7eb;
    }
  }

  &__error {
    margin: 7px 0;
    color: #c21313;
  }
}
</style>
