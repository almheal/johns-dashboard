module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  transform: {
    "^.+\\.vue$": "vue-jest",
  },
  testMatch: ["**/__tests__/*.{j,t}s?(x)", "**/tests/**/*.spec.{j,t}s?(x)"],
};
