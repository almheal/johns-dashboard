<template>
  <div class="notification">
    <div
      class="notification__item"
      :class="{ error: notification.isError, success: !notification.isError }"
      v-for="(notification, index) in notifications"
      :key="index"
    >
      <div class="notification__icon">
        <app-danger-icon class="icon" v-if="notification.isError" />
        <app-success-icon class="icon" v-else />
      </div>
      <div class="notification__content">
        <div class="notification__title">
          {{ notification.isError ? "Error" : "Success" }}
        </div>
        <div class="notification__text">
          <p>
            {{
              $t(
                `${notification.isError ? "errors" : "success"}.${
                  notification.messageCode
                }`
              )
            }}
          </p>
        </div>
        <button
          class="button-cross"
          @click="$emit('closeNotification', notification.id)"
        >
          <app-cross-icon class="icon icon__cross" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AppDangerIcon from "@/components/icons/AppDangerIcon";
import AppSuccessIcon from "@/components/icons/AppSuccessIcon";
import AppCrossIcon from "@/components/icons/AppCrossIcon";

export default {
  name: "TheNotification",
  components: {
    AppDangerIcon,
    AppSuccessIcon,
    AppCrossIcon,
  },
  emits: ["closeNotification"],
  props: {
    notifications: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped>
.notification {
  position: fixed;
  left: 10px;
  bottom: 10px;

  &__item {
    position: relative;
    display: flex;
    width: 380px;
    min-height: 60px;
    padding: 10px 10px 10px 64px;
    background-color: #fff;
    border-radius: 7px;
    margin-bottom: 15px;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.3);

    &:last-child {
      margin-bottom: 0;
    }

    &.error {
      .notification__icon {
        background-color: rgb(239, 68, 68);
      }

      .notification__title {
        color: rgb(239, 68, 68);
      }
    }

    &.success {
      .notification__icon {
        background-color: rgb(16, 185, 129);
      }
      .notification__title {
        color: rgb(16, 185, 129);
      }
    }
  }

  &__icon {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 100%;
    border-radius: 7px 0 0 7px;
  }

  &__content {
    position: relative;
    flex: 1 1 0;
    padding-right: 25px;
  }

  &__title {
    font-weight: 400;
    font-size: 16px;
    margin-bottom: 6px;
  }

  &__text {
    color: rgb(75, 85, 99);
    line-height: 1.3;
  }
}

.button-cross {
  display: block;
  background-color: transparent;
  position: absolute;
  right: 0;
  top: 0;
  color: rgb(75, 85, 99);

  &:hover {
    .icon__cross {
      fill: rgb(239, 68, 68);
    }
  }
}

.icon {
  width: 17px;
  height: 17px;
  color: #fff;

  &__cross {
    fill: rgb(75, 85, 99);
    transition: color 0.2s;
  }
}
</style>
