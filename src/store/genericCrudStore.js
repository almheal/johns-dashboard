import genericService from "@/services/generic.service";

const genericCrudStore = (url) => {
  const service = genericService(url);

  return {
    state: {
      items: [],
      item: {},
    },
    getters: {
      getItems: ({ items }) => items,
      getItem: ({ item }) => item,
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
      }
    },
    actions: {
      async createItem({ commit }, body) {
        try {
          const { data } = await service.create(body);
          commit("addNewItem", data);
        } catch (messageCodes) {
          return Promise.reject(messageCodes);
        }
      },
      async getAllItems({ commit }) {
        try {
          const { data } = await service.getAll();
          commit("setItems", data);
        } catch (messageCodes) {
          return Promise.reject(messageCodes);
        }
      },
      async getItem({ commit }, id) {
        try {
          const { data } = await service.get(id);
          commit("addNewItem", data);
        } catch (messageCodes) {
          return Promise.reject(messageCodes);
        }
      },
      async updateItem({ commit, getters }, { id, body }) {
        try {
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
        } catch (messageCodes) {
          return Promise.reject(messageCodes);
        }
      },
      async delete({ commit, getters }, id) {
        try {
          const { data } = await service.delete(id);
          const items = getters.getItems;

          const updatedItems = items.filter((item) => item._id !== data._id);
          commit("setItems", updatedItems);
        } catch (messageCodes) {
          return Promise.reject(messageCodes);
        }
      },
    },
  };
};

export default genericCrudStore;
