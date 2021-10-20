import { loginUser, authUser } from "@/services/auth.service";
import { setLocalStorage } from "@/utils";
import { ROLES_NAME } from "@/consts";

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
      setLocalStorage({ key: ROLES_NAME, data: data.roles });
      commit("setUser", data.user);
    } catch (messageCodes) {
      return { messageCodes };
    } finally {
      commit("setLoading", false);
    }
  },
  async auth({ commit }) {
    try {
      const { data } = await authUser();
      setLocalStorage({ key: ROLES_NAME, data: data.roles });
      commit("setUser", data);
    } catch (messageCodes) {
      return { messageCodes };
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
