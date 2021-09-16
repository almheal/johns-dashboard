import store from "@/store";

export const notificationHandler = (messageCodes, isError = false) => {
  let notificationId = (Math.random() * Date.now()) / Math.random();
  messageCodes.forEach((code) => {
    const upgradeNotification = {
      messageCode: code,
      isError,
      id: notificationId,
    };
    store.dispatch("notification/setNotification", upgradeNotification);
  });
};
