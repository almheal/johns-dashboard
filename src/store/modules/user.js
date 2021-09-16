import { loginUser, authUser } from "@/services/auth.service";

const state = () => ({
  user: {},
  isLoading: false,
});

const getters = {
  getUser: ({ user }) => user,
  getLoader: ({ isLoading }) => isLoading,
};

const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setLoading(state, value) {
    state.isLoading = value;
  },
};

const actions = {
  async login({ commit }, body) {
    try {
      commit("setLoading", true);
      const { data } = await loginUser(body);
      commit("setUser", data.user);
    } catch (messageCodes) {
      return Promise.reject(messageCodes);
    } finally {
      commit("setLoading", false);
    }
  },
  async auth({ commit }) {
    try {
      const { data } = await authUser();
      commit("setUser", data);
    } catch (messageCodes) {
      return Promise.reject(messageCodes);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
