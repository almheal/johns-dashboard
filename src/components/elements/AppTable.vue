<template>
  <table class="app-table">
    <thead class="app-table__header">
      <tr class="app-table__row">
        <th class="app-table__head" v-if="isNumeration">№</th>
        <th
          class="app-table__head"
          v-for="(column, index) in columns"
          :key="index"
        >
          {{ column.title }}
        </th>
        <th class="app-table__head" v-if="cross"></th>
      </tr>
    </thead>
    <tbody class="app-table__body">
      <tr
        class="app-table__row"
        :class="{
          'app-table__row_grey-hover': row.hover,
          'app-table__row_clickable': row.clickable,
        }"
        v-for="(row, index) in rows"
        :key="index"
        @click="$emit('clickOnRow', row)"
      >
        <td class="app-table__cell" v-if="isNumeration">{{ index + 1 }}</td>
        <td
          class="app-table__cell"
          v-for="(cell, index) in row.cells"
          :key="index"
        >
          {{ cell.title }}
        </td>
        <td
          class="app-table__cell app-table__cell-cross"
          v-if="cross"
          @click.stop="$emit('clickCross', row)"
        >
          <app-cross-icon class="app-table__cross" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import AppCrossIcon from "@/components/icons/AppCrossIcon";

export default {
  name: "AppTable",
  components: {
    AppCrossIcon,
  },
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    rows: {
      type: Array,
      default: () => [],
    },
    isNumeration: {
      type: Boolean,
      default: false,
    },
    cross: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.app-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0px 1px 3px 0px rgba(#000, 0.1);
  border-radius: 6px;
  overflow: hidden;
  text-align: left;
  font-size: 16px;

  &__head {
    background-color: rgb(243, 244, 246);
    padding: 12px 20px;
    color: rgb(75, 85, 99);
    font-weight: 400;
    overflow: hidden;
  }

  &__row {
    &_grey-hover {
      &:hover {
        .app-table__cell {
          background-color: rgb(229, 231, 235);
        }
      }
    }

    &_clickable {
      cursor: pointer;
    }
  }

  &__cell {
    padding: 16px 24px;
    border-top: 1px solid rgb(229, 231, 235);
    border-bottom: 1px solid rgb(229, 231, 235);
    overflow: hidden;
    background-color: #fff;
    transition: background-color 0.3s;

    &-cross {
      width: 35px;

      &:hover {
        .app-table__cross {
          color: rgb(239, 68, 68);
        }
      }
    }
  }

  &__cross {
    width: 24px;
    height: 24px;
    transition: color 0.3s;
  }
}
</style>
