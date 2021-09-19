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
          {{ $t(column.title) }}
        </th>
        <th class="app-table__head" v-if="cross || edit"></th>
      </tr>
    </thead>
    <tbody class="app-table__body">
      <tr
        class="app-table__row"
        :class="{
          'app-table__row_grey-hover': row.hover,
          'app-table__row_clickable': row.clickable,
          'app-table__row_is-hidden': loading,
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
          :style="{ color: cell.color ? cell.color : '' }"
        >
          {{ $t(cell.title) }}
        </td>
        <td class="app-table__cell app-table__cell_icons" v-if="cross || edit">
          <div class="app-table__icons">
            <div
              class="app-table__icon app-table__icon_edit"
              v-if="edit"
              @click.stop="$emit('clickEdit', row)"
            >
              <app-edit-icon class="app-table__edit" />
            </div>
            <div
              class="app-table__icon"
              v-if="cross"
              @click.stop="$emit('clickCross', row)"
            >
              <app-cross-icon class="app-table__cross" />
            </div>
          </div>
        </td>
      </tr>
      <tr class="app-table__row" v-if="!rows.length">
        <td
          class="app-table__cell app-table__cell_text-center"
          :colspan="emptyColLength"
          v-if="!loading"
        >
          {{ $t("admin.utils.listEmpty") }}
        </td>
        <td
          class="app-table__cell app-table__cell_stub"
          :colspan="emptyColLength"
          v-else
        ></td>
      </tr>
      <app-circle-loader
        class="app-table__loader"
        color="blue"
        size="large"
        v-if="loading"
      />
    </tbody>
  </table>
</template>

<script>
import AppCrossIcon from "@/components/icons/AppCrossIcon";
import AppEditIcon from "@/components/icons/AppEditIcon";
import AppCircleLoader from "@/components/elements/AppCircleLoader";

export default {
  name: "AppTable",
  components: {
    AppCrossIcon,
    AppEditIcon,
    AppCircleLoader,
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
    edit: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    emptyColLength() {
      let additionalCols = 0;
      additionalCols += this.cross || this.edit ? 1 : 0;
      additionalCols += this.isNumeration ? 1 : 0;

      return this.columns.length + additionalCols;
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

  &__body {
    position: relative;
  }

  &__row {
    position: relative;
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

    &_is-hidden {
      background-color: #fff;
      .app-table__cell {
        z-index: -5;
      }
    }
  }

  &__cell {
    position: relative;
    padding: 12px 20px;
    border-top: 1px solid rgb(229, 231, 235);
    border-bottom: 1px solid rgb(229, 231, 235);
    overflow: hidden;
    background-color: #fff;
    transition: background-color 0.3s;

    &_icons {
      padding: 0 20px;
      width: 76px;
    }

    &_text-center {
      text-align: center;
    }

    &_stub {
      height: 100px;
    }
  }

  &__icons {
    display: flex;
    align-items: center;
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 41px;
    width: 38px;
    cursor: pointer;

    &:hover {
      .app-table__cross {
        fill: rgb(239, 68, 68);
      }
      .app-table__edit {
        fill: #4f46e5;
      }
    }
  }

  &__loader {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  &__cross {
    width: 14px;
    height: 14px;
    transition: fill 0.3s;
  }

  &__edit {
    width: 18px;
    height: 18px;

    transition: fill 0.3s;
  }
}
</style>
