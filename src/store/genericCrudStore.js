import genericService from "@/services/generic.service";

const genericCrudStore = (url) => {
  const service = genericService(url);

  return {
    state: {
      items: [],
      item: {},
      loader: false,
      createLoader: false,
      getItemsLoader: false,
      getItemLoader: false,
      updateLoader: false,
      deleteLoader: false,
      lengthAllItems: 0,
    },
    getters: {
      getItems: ({ items }) => items,
      getItem: ({ item }) => item,
      getLoader: ({ loader }) => loader,
      getLength: ({ lengthAllItems }) => lengthAllItems,
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
      setLoader(state, { property, value }) {
        state[property] = value;
      },
      setLengthAllItems(state, length) {
        state.lengthAllItems = length;
      },
      calculateAllItemsLength(state, { operation, value }) {
        if (operation === "+") {
          state.lengthAllItems = Number(state.lengthAllItems) + Number(value);
        } else {
          state.lengthAllItems = Number(state.lengthAllItems) - Number(value);
        }
      },
    },
    actions: {
      async createItem({ commit }, { body, addNew = true }) {
        try {
          commit("setLoader", { property: "createLoader", value: true });
          const { data } = await service.create(body);
          if (addNew) {
            commit("addNewItem", data);
          }
          commit("calculateAllItemsLength", { operation: "+", value: 1 });
          return data;
        } catch (messageCodes) {
          return { messageCodes };
        } finally {
          commit("setLoader", { property: "createLoader", value: false });
        }
      },
      async getAllItems({ commit }, query) {
        try {
          commit("setLoader", { property: "getItemsLoader", value: true });
          const { data: body } = await service.getAll(query);

          if (body.data && body.length) {
            commit("setItems", body.data);
            commit("setLengthAllItems", body.length);
          } else {
            commit("setItems", body);
          }
        } catch (messageCodes) {
          return { messageCodes };
        } finally {
          commit("setLoader", { property: "getItemsLoader", value: false });
        }
      },
      async getItem({ commit }, { id, addNew = true, setItem = false }) {
        try {
          commit("setLoader", { property: "getItemLoader", value: true });
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
        } finally {
          commit("setLoader", { property: "getItemLoader", value: false });
        }
      },
      async updateItem({ commit, getters }, { id, body }) {
        try {
          commit("setLoader", { property: "updateLoader", value: true });
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
          commit("setLoader", { property: "updateLoader", value: false });
        }
      },
      async deleteItem({ commit, getters }, { id, isDelete = true }) {
        try {
          commit("setLoader", { property: "deleteLoader", value: true });
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
          commit("setLoader", { property: "deleteLoader", value: false });
        }
      },
    },
  };
};

export default genericCrudStore;
