import genericCrudStore from "../genericCrudStore";

const crudStore = genericCrudStore("/tags");

const state = () => ({
  ...crudStore.state,
});

const getters = {
  ...crudStore.getters,
};

const mutations = {
  ...crudStore.mutations,
};

const actions = {
  ...crudStore.actions,
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
