import { createStore } from "vuex";
import user from "./modules/user";
import notification from "./modules/notification";
import locale from "./modules/locale";

export default createStore({
  modules: {
    user,
    notification,
    locale,
  },
});
