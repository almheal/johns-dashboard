import genericService from "@/services/generic.service";

const genericCrudStore = (url) => {
  const service = genericService(url);

  return {
    state: {
      items: [],
      item: {},
      loader: false,
      length: null,
    },
    getters: {
      getItems: ({ items }) => items,
      getItem: ({ item }) => item,
      getLoader: ({ loader }) => loader,
      getLength: ({ length }) => length,
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
      setLength(state, length) {
        state.length = length;
      },
    },
    actions: {
      async createItem({ commit }, { body, addNew = true }) {
        try {
          commit("setLoader", true);
          const { data } = await service.create(body);
          if (addNew) {
            commit("addNewItem", data);
          }
          return data;
        } catch (messageCodes) {
          return { messageCodes };
        } finally {
          commit("setLoader", false);
        }
      },
      async getAllItems({ commit }, query) {
        try {
          commit("setLoader", true);
          const { data: body } = await service.getAll(query);

          if (body.length) {
            commit("setItems", body.data);
            commit("setLength", body.length);
          } else {
            commit("setItems", body);
          }
        } catch (messageCodes) {
          return { messageCodes };
        } finally {
          commit("setLoader", false);
        }
      },
      async getItem({ commit }, { id, addNew = true, setItem = false }) {
        try {
          const { data } = await service.get(id);
          if (addNew) {
            commit("addNewItem", data);
          }
          if (setItem) {
            commit("setItem", data);
          }
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
      async deleteItem({ commit, getters }, { id, isDelete = true }) {
        try {
          commit("setLoader", true);
          const { data } = await service.delete(id);

          if (isDelete) {
            const items = getters.getItems;

            const updatedItems = items.filter((item) => item._id !== data._id);
            commit("setItems", updatedItems);
          }
          return data;
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
