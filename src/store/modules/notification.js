import { NOTIFICATION_CLEAR_INTERVAL } from "@/consts";

const state = () => ({
  notifications: [],
});

const getters = {
  getNotifications: ({ notifications }) => notifications,
};

const mutations = {
  addNotification(state, notification) {
    state.notifications.push(notification);
  },
  setNotifications(state, notifications) {
    state.notifications = notifications;
  },
};

const actions = {
  setNotification({ commit, getters }, notification) {
    const notifications = getters.getNotifications;

    if (!notifications.length) {
      const clearNotificationInterval = setInterval(() => {
        const notifications = [...getters.getNotifications];
        notifications.splice(-1, 1);

        if (!notifications.length) {
          clearInterval(clearNotificationInterval);
        }

        commit("setNotifications", notifications);
      }, NOTIFICATION_CLEAR_INTERVAL);
    }
    commit("addNotification", notification);
  },
  removeNotification({ commit, getters }, id) {
    const notifications = getters.getNotifications;

    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== id
    );
    commit("setNotifications", updatedNotifications);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
