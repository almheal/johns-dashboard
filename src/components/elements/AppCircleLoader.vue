<template>
  <div class="app-loader">
    <div class="app-loader__item"></div>
    <div class="app-loader__item"></div>
    <div class="app-loader__item"></div>
  </div>
</template>

<script>
export default {
  name: "AppCircleLoader",
};
</script>

<style lang="scss" scoped>
.app-loader {
  display: inline-block;
  position: relative;
  width: 32px;
  height: 32px;

  &__item {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 26px;
    height: 26px;
    margin: 4px;
    border: 3px solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;

    &:nth-child(1) {
      animation-delay: -0.4s;
    }

    &:nth-child(2) {
      animation-delay: -0.25s;
    }

    &:nth-child(3) {
      animation-delay: -0.1s;
    }
  }
}

@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
