import router from "@/router";
import { ERRORS_MESSAGE_CODES } from "@/consts/errors";
import { USER_TOKEN_NAME } from "@/consts";
import { setLocalStorage } from "@/utils";
import { notificationHandler } from "./notificationHandler";

export const errorsHandler = (err) => {
  const { message } = err.response.data;

  if (!message || !Array.isArray(message)) {
    const messageCodes = [ERRORS_MESSAGE_CODES.BAD_REQUEST];
    notificationHandler(messageCodes, true);
    return Promise.reject(messageCodes);
  }

  if (
    message.includes(
      ERRORS_MESSAGE_CODES.FORBIDDEN || ERRORS_MESSAGE_CODES.USER_NOT_AUTHORIZED
    )
  ) {
    router.push("/login");
    setLocalStorage({ key: USER_TOKEN_NAME, data: "" });
  }

  if (!message.includes(ERRORS_MESSAGE_CODES.USER_NOT_AUTHORIZED)) {
    notificationHandler(message, true);
  }

  return Promise.reject(message);
};
