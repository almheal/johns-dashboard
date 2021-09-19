<template>
  <nav class="menu">
    <ul class="menu__list">
      <li
        class="menu__item"
        v-for="(item, index) in menu"
        :key="index"
        :class="{ active: item.link === getCurrentPath }"
        @click="clickOnItem(item)"
      >
        <component class="menu__icon" :is="item.icon"></component>
        <span>{{ $t(item.name) }}</span>
      </li>
    </ul>
  </nav>
</template>

<script>
import AppTranslationIcon from "@/components/icons/AppTranslationIcon";
import AppDashboardIcon from "@/components/icons/AppDashboardIcon";
import AppTagIcon from "@/components/icons/AppTagIcon";

export default {
  name: "NavigationMenu",
  components: {
    AppTranslationIcon,
    AppDashboardIcon,
    AppTagIcon,
  },
  props: {
    menu: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    getCurrentPath() {
      return this.$route.path;
    },
  },
  methods: {
    clickOnItem(item) {
      this.$router.push(item.link);
    },
  },
};
</script>

<style lang="scss" scoped>
.menu {
  &__item {
    position: relative;
    display: flex;
    align-items: center;
    font-size: 18px;
    color: rgb(107, 114, 128);
    padding: 12px 24px;
    margin-bottom: 16px;
    cursor: pointer;
    transition: 0.3s;

    &::before {
      content: "";
      width: 4px;
      height: 100%;
      background-color: #fff;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.3s;
    }

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      background-color: rgba(75, 85, 99, 0.25);
      color: rgb(243, 244, 246);
      transition: 0.3s;

      & .menu__icon {
        fill: rgb(243, 244, 246);
      }
    }

    &.active {
      &::before {
        opacity: 1;
      }
    }
  }

  &__icon {
    width: 20px;
    height: 20px;
    fill: rgb(107, 114, 128);
    margin-right: 14px;
    transition: fill 0.3s;
  }
}
</style>
