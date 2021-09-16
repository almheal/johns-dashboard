import { createStore } from "vuex";
import user from "./modules/user";
import notification from "./modules/notification";

export default createStore({
  modules: {
    user,
    notification,
  },
});
