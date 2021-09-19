<template>
  <div class="pagination">
    <div class="pagination__list">
      <div
        class="pagination__item pagination__item_icon"
        v-if="currentPage > 1"
        @click="changePage(currentPage - 1)"
      >
        <app-arrow-right-icon
          class="pagination__arrow pagination__arrow_left"
        />
      </div>
      <div
        class="pagination__item"
        v-for="(num, index) in pagesLength"
        :key="index"
        :class="{ active: String(num) === String(currentPage) }"
        @click="changePage(num)"
      >
        {{ num }}
      </div>
      <div
        class="pagination__item pagination__item_icon"
        v-if="currentPage < pagesLength"
        @click="changePage(Number(currentPage) + 1)"
      >
        <app-arrow-right-icon class="pagination__arrow" />
      </div>
    </div>
  </div>
</template>

<script>
import AppArrowRightIcon from "@/components/icons/AppArrowRightIcon";
import { calculatePagination } from "@/utils";
import { LIMIT_ITEMS } from "@/consts";

export default {
  name: "AppPagination",
  components: {
    AppArrowRightIcon,
  },
  props: {
    length: {
      type: Number,
      default: 1,
    },
    limit: {
      type: Number,
      default: LIMIT_ITEMS,
    },
  },
  computed: {
    currentPage() {
      const page = this.$route.query.page;
      return page ? page : 1;
    },
    pagesLength() {
      return Math.ceil(this.length / this.limit);
    },
  },
  methods: {
    async changePage(num) {
      if (String(num) === String(this.currentPage)) {
        return;
      }
      await this.$router.replace({
        query: {
          page: num,
        },
      });

      this.$emit(
        "changePage",
        calculatePagination({ limit: this.limit, page: this.$route.query.page })
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  &__list {
    display: flex;
    border-radius: 4px;
  }

  &__item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 38px;
    color: rgb(67, 56, 202);
    font-size: 16px;
    padding: 8px 12px;
    margin-right: 10px;
    cursor: pointer;
    transition: 0.3s;

    &:last-child {
      border-right: 0;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      margin-right: 0;
    }

    &:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    &:hover {
      background-color: rgb(99, 102, 241);
      border-color: rgb(99, 102, 241);
      color: #fff;
      transition: 0.3s;

      .pagination__arrow {
        fill: #fff;
      }
    }

    &.active {
      background-color: rgb(99, 102, 241);
      border-color: rgb(99, 102, 241);
      color: #fff;
      cursor: initial;
    }

    &_icon {
      padding: 8px;
    }
  }

  &__arrow {
    width: 13px;
    height: 14px;
    fill: rgb(99, 102, 241);
    transition: fill 0.3s;

    &_left {
      transform: rotate(-180deg);
    }
  }
}
</style>
