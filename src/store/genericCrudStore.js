import genericService from "@/services/generic.service";

const genericCrudStore = (url) => {
  const service = genericService(url);

  return {
    state: {
      items: [],
      item: {},
      loader: false,
    },
    getters: {
      getItems: ({ items }) => items,
      getItem: ({ item }) => item,
      getLoader: ({ loader }) => loader,
    },
    mutations: {
      setItems(state, items) {
        state.items = items;
      },
      setItem(state, item) {
        state.item = item;
      },
      addNewItem(state, item) {
        state.items.push(item);
      },
      setLoader(state, value) {
        state.loader = value;
      },
    },
    actions: {
      async createItem({ commit }, body) {
        try {
          commit("setLoader", true);
          const { data } = await service.create(body);
          commit("addNewItem", data);
          return data;
        } catch (messageCodes) {
          return { messageCodes };
        } finally {
          commit("setLoader", false);
        }
      },
      async getAllItems({ commit }) {
        try {
          const { data } = await service.getAll();
          commit("setItems", data);
        } catch (messageCodes) {
          return { messageCodes };
        }
      },
      async getItem({ commit }, id) {
        try {
          const { data } = await service.get(id);
          commit("addNewItem", data);
          return data;
        } catch (messageCodes) {
          return { messageCodes };
        }
      },
      async updateItem({ commit, getters }, { id, body }) {
        try {
          commit("setLoader", true);
          const { data } = await service.update(id, body);
          const items = getters.getItems;

          const updatedItems = items.map((item) => {
            if (item._id === data._id) {
              return data;
            } else {
              return item;
            }
          });
          commit("setItems", updatedItems);
          return data;
        } catch (messageCodes) {
          return { messageCodes };
        } finally {
          commit("setLoader", false);
        }
      },
      async deleteItem({ commit, getters }, id) {
        try {
          commit("setLoader", true);
          const { data } = await service.delete(id);
          const items = getters.getItems;

          const updatedItems = items.filter((item) => item._id !== data._id);
          commit("setItems", updatedItems);
        } catch (messageCodes) {
          return { messageCodes };
        } finally {
          commit("setLoader", false);
        }
      },
    },
  };
};

export default genericCrudStore;
