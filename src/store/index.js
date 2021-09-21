import { createStore } from "vuex";
import user from "./modules/user";
import notification from "./modules/notification";
import locale from "./modules/locale";
import localeMessages from "./modules/localeMessages";
import tag from "./modules/tag";
import ingredient from "./modules/ingredient";

export default createStore({
  modules: {
    user,
    notification,
    locale,
    localeMessages,
    tag,
    ingredient,
  },
});
