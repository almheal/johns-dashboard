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
      >
        <td class="app-table__cell" v-if="isNumeration">{{ index + 1 }}</td>
        <td
          class="app-table__cell"
          v-for="(cell, index) in row.cells"
          :key="index"
        >
          {{ cell.title }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "AppTable",
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
  },
};
</script>

<style lang="scss" scoped>
.app-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 1px 1px 3px 0px rgba(#000, 0.6);
  border-radius: 6px;
  overflow: hidden;
  text-align: left;
  font-size: 16px;

  &__head {
    background-color: rgb(55, 48, 163);
    padding: 12px 20px;
    color: #fff;
    font-weight: 400;
    overflow: hidden;
  }

  &__row {
    transition: 0.3s;

    &_grey-hover {
      &:hover {
        background-color: rgb(229, 231, 235);
        transition: 0.3s;
      }
    }

    &_clickable {
      cursor: pointer;
    }
  }

  &__cell {
    padding: 16px 24px;
    border-bottom: 1px solid rgb(229, 231, 235);
    overflow: hidden;
  }
}
</style>
